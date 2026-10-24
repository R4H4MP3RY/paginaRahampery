"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clientIp } from "@/lib/client-ip";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string };

const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(200),
});

// Registro de accesos al panel para detectar ataques (visible en los logs de Vercel).
// Nunca incluye la contraseña; del correo solo se guarda el dominio.
async function logAuthEvent(event: string, fields: { reason?: string; email?: string } = {}) {
  const entry = JSON.stringify({
    event,
    reason: fields.reason,
    emailDomain: fields.email?.split("@")[1],
    ip: clientIp(await headers()),
    at: new Date().toISOString(),
  });
  if (event === "admin_login_failed") console.warn(entry);
  else console.info(entry);
}

const logLoginFailure = (reason: string, email?: string) => logAuthEvent("admin_login_failed", { reason, email });

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  // Mensaje genérico: no revelar si el correo existe.
  const invalid = { error: "Correo o contraseña incorrectos." };
  if (!parsed.success) {
    await logLoginFailure("datos_invalidos");
    return invalid;
  }

  // Supabase verifica el token de Turnstile (Authentication → Attack Protection).
  // No se verifica también aquí: cada token sirve una sola vez.
  const captchaToken = String(formData.get("cf-turnstile-response") ?? "");
  if (!captchaToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    await logLoginFailure("sin_captcha", parsed.data.email);
    return { error: "No pudimos verificar que eres una persona. Recarga la página e inténtalo de nuevo." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    ...parsed.data,
    options: { captchaToken: captchaToken || undefined },
  });
  if (error) {
    await logLoginFailure(error.code ?? "credenciales", parsed.data.email);
    return invalid;
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await logLoginFailure("no_admin", parsed.data.email);
    await supabase.auth.signOut();
    return { error: "Esta cuenta no tiene acceso al panel." };
  }

  await logAuthEvent("admin_login_success", { email: parsed.data.email });
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await logAuthEvent("admin_logout");
  redirect("/admin/login");
}
