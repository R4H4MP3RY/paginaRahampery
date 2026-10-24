import "server-only";
import { site } from "@/lib/site";

// Dominios donde se muestra el widget: un token resuelto en otro sitio no se acepta.
// localhost solo en desarrollo, para que nadie resuelva el reto en su computadora y
// envíe ese token al sitio real.
const domain = new URL(site.url).hostname;
const allowedHostnames = new Set([domain, `www.${domain}`]);
if (process.env.NODE_ENV !== "production") allowedHostnames.add("localhost");

// Verifica el token anti-spam de Cloudflare Turnstile.
export async function verifyTurnstile(token: string, ip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // En local se permite trabajar sin Turnstile; en producción es obligatorio.
    return process.env.NODE_ENV !== "production";
  }
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  // Si Cloudflare no responde en 5 s o responde algo inesperado, se rechaza con el
  // mensaje normal de verificación en lugar de dejar la solicitud colgada o dar error 500.
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success: boolean; hostname?: string };
    return data.success && allowedHostnames.has(data.hostname ?? "");
  } catch (error) {
    console.error("turnstile siteverify", error instanceof Error ? error.name : "desconocido");
    return false;
  }
}
