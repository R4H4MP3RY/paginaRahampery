"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTurnstile } from "@/lib/turnstile";
import { ageFrom, quoteSchema, sexOptions, type QuoteFormState } from "@/lib/quote-schema";
import { insurances } from "@/lib/site";

export async function submitQuote(_prev: QuoteFormState, formData: FormData): Promise<QuoteFormState> {
  // Honeypot: campo oculto que solo llenan los bots. Se responde "ok" para no darles pistas.
  if (formData.get("website")) return { ok: true, message: "¡Gracias! Te contactaré muy pronto." };

  const values = Object.fromEntries(
    ["fullName", "email", "phone", "birthDate", "sex", "city", "insuranceType", "message", "privacy"].map((k) => [
      k,
      String(formData.get(k) ?? ""),
    ]),
  );

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const token = String(formData.get("cf-turnstile-response") ?? "");
  if (!(await verifyTurnstile(token, ip))) {
    return {
      ok: false,
      values,
      message: "No pudimos verificar que eres una persona. Recarga la página e inténtalo de nuevo.",
    };
  }

  const parsed = quoteSchema.safeParse({
    ...values,
    city: values.city || undefined,
    message: values.message || undefined,
  });
  if (!parsed.success) {
    return {
      ok: false,
      values,
      message: "Revisa los campos marcados.",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const data = parsed.data;
  const supabase = createAdminClient();
  if (!(await withinRateLimit(supabase, ip, data.email))) {
    return {
      ok: false,
      values,
      message: "Recibimos varias solicitudes en poco tiempo. Inténtalo más tarde o escríbeme por WhatsApp.",
    };
  }

  const { error } = await supabase.from("quote_requests").insert({
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    birth_date: data.birthDate,
    sex: data.sex,
    city: data.city ?? null,
    insurance_type: data.insuranceType,
    message: data.message ?? null,
    privacy_accepted_at: new Date().toISOString(),
  });
  if (error) {
    console.error("quote_requests insert", error.code, error.message);
    return {
      ok: false,
      values,
      message: "Ocurrió un error al enviar tu solicitud. Inténtalo de nuevo o escríbeme por WhatsApp.",
    };
  }

  // El aviso por correo se envía después de responder para no hacer esperar al usuario.
  after(() => notifyNewQuote(data));

  return { ok: true, message: "¡Gracias! Recibí tu solicitud y te contactaré muy pronto." };
}

const MAX_PER_IP_PER_HOUR = 5;
const MAX_PER_EMAIL_PER_DAY = 3;

// Si la revisión falla por un error de Supabase se deja pasar: es preferible
// recibir una solicitud de más que perder un cliente real.
async function withinRateLimit(supabase: ReturnType<typeof createAdminClient>, ip: string | null, email: string) {
  if (ip) {
    // HMAC con la secret key: la IP no se puede recuperar a partir del hash.
    const ipHash = createHmac("sha256", process.env.SUPABASE_SECRET_KEY ?? "").update(ip).digest("hex");
    const { data, error } = await supabase.rpc("register_quote_attempt", {
      p_ip_hash: ipHash,
      p_max: MAX_PER_IP_PER_HOUR,
      p_window: "1 hour",
    });
    if (error) console.error("register_quote_attempt", error.code, error.message);
    else if (data === false) return false;
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from("quote_requests")
    .select("id", { count: "exact", head: true })
    // ilike para ignorar mayúsculas; se escapan % y _ para que no actúen como comodines.
    .ilike("email", email.replace(/[\\%_]/g, "\\$&"))
    .gte("created_at", since);
  if (error) console.error("quote rate limit email", error.code, error.message);
  return (count ?? 0) < MAX_PER_EMAIL_PER_DAY;
}

async function notifyNewQuote(data: z.infer<typeof quoteSchema>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !to || !from) return;

  const insurance = insurances.find((i) => i.slug === data.insuranceType)?.name ?? data.insuranceType;
  // Texto plano: evita inyectar HTML con los datos que escribe el usuario.
  const text = [
    `Nueva solicitud de cotización: ${insurance}`,
    "",
    `Nombre: ${data.fullName}`,
    `Correo: ${data.email}`,
    `Teléfono: ${data.phone}`,
    `Fecha de nacimiento: ${data.birthDate} (${ageFrom(data.birthDate)} años)`,
    `Sexo: ${sexOptions.find((o) => o.value === data.sex)?.label ?? data.sex}`,
    `Ciudad: ${data.city ?? "-"}`,
    "",
    data.message ?? "",
  ].join("\n");

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `Nueva cotización: ${insurance} - ${data.fullName}`,
    text,
  });
  if (error) console.error("resend", error);
}
