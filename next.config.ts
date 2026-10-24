import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
// Sin la URL, la CSP bloquearía Supabase y el sitio fallaría en silencio: mejor detener el build.
if (!supabaseUrl && process.env.NODE_ENV === "production") {
  throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL");
}
const supabaseWs = supabaseUrl.replace(/^https:/, "wss:");

// CSP estática (sin nonces) para que las páginas sigan generándose de forma
// estática: mejor rendimiento y SEO. Next necesita 'unsafe-inline' en scripts
// para hidratar sin nonces.
const csp = [
  "default-src 'self'",
  // En desarrollo, Vercel Analytics/Speed Insights cargan sus scripts de depuración desde va.vercel-scripts.com;
  // en producción se sirven desde el propio dominio (/_vercel/...).
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data: ${supabaseUrl}`.trim(),
  "font-src 'self'",
  `connect-src 'self' ${supabaseUrl} ${supabaseWs}`.trim(),
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    // Portadas del blog en Supabase Storage.
    remotePatterns: supabaseUrl ? [new URL(`${supabaseUrl}/storage/v1/object/public/blog/**`)] : [],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
