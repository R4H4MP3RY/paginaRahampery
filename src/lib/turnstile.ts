import "server-only";
import { site } from "@/lib/site";

// Dominios donde se muestra el widget: un token resuelto en otro sitio no se acepta.
const domain = new URL(site.url).hostname;
const allowedHostnames = new Set([domain, `www.${domain}`, "localhost"]);

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

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean; hostname?: string };
  return data.success && allowedHostnames.has(data.hostname ?? "");
}
