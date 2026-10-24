"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string };

const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(200),
});

// Registro de intentos de acceso para detectar ataques (visible en los logs de Vercel).
// Nunca incluye la contraseña; del correo solo se guarda el dominio.
async function logLoginFailure(reason: string, email?: string) {
  const h = await headers();
  console.warn(
    JSON.stringify({
      event: "admin_login_failed",
      reason,
      emailDomain: email?.split("@")[1],
      ip: h.get("x-forwarded-for")?.split(",")[0]?.trim(),
      at: new Date().toISOString(),
    }),
  );
}

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

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
