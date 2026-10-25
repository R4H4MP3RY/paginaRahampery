import "server-only";
import { headers } from "next/headers";
import { clientIp } from "@/lib/client-ip";

type AdminEventFields = {
  reason?: string;
  // Del correo solo se guarda el dominio.
  email?: string;
  userId?: string;
  // Id o ruta del registro afectado (artículo, cotización, imagen).
  target?: string;
};

// Registro de seguridad del panel en JSON (visible en los logs de Vercel): accesos,
// accesos denegados y cambios hechos por el administrador. Nunca incluye contraseñas
// ni contenido; JSON.stringify evita que un valor rompa la línea del log.
export async function logAdminEvent(event: string, fields: AdminEventFields = {}) {
  const entry = JSON.stringify({
    event,
    reason: fields.reason,
    emailDomain: fields.email?.split("@")[1],
    userId: fields.userId,
    target: fields.target,
    ip: clientIp(await headers()),
    at: new Date().toISOString(),
  });
  if (event.endsWith("_failed") || event.endsWith("_denied")) console.warn(entry);
  else console.info(entry);
}
