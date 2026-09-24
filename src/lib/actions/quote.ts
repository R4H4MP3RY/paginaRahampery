"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTurnstile } from "@/lib/turnstile";
import { quoteSchema, type QuoteFormState } from "@/lib/quote-schema";
import { insurances } from "@/lib/site";

export async function submitQuote(_prev: QuoteFormState, formData: FormData): Promise<QuoteFormState> {
  // Honeypot: campo oculto que solo llenan los bots. Se responde "ok" para no darles pistas.
  if (formData.get("website")) return { ok: true, message: "¡Gracias! Te contactaré muy pronto." };

  const values = Object.fromEntries(
    ["fullName", "email", "phone", "city", "insuranceType", "message", "privacy"].map((k) => [
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
  const { error } = await supabase.from("quote_requests").insert({
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
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
