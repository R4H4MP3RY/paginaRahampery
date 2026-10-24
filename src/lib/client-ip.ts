import "server-only";

// IP del visitante. En Vercel, x-vercel-forwarded-for lo pone la plataforma y el cliente
// no puede falsificarlo; x-forwarded-for solo es confiable detrás de un proxy que lo
// sobrescriba (también es el caso de Vercel). Si el sitio se mueve a otro hosting, revisar.
export function clientIp(h: Headers) {
  const ip = h.get("x-vercel-forwarded-for") ?? h.get("x-real-ip") ?? h.get("x-forwarded-for");
  return ip?.split(",")[0]?.trim() || null;
}
