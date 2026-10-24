import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookieOptions } from "@/lib/supabase/cookie-options";
import { themeInitScript } from "@/lib/theme";

const isDev = process.env.NODE_ENV === "development";

// El script de tema va escrito en el <head> del layout raíz (compartido con el sitio
// estático), así que se permite por su hash en lugar de con nonce.
const themeScriptHash = `'sha256-${createHash("sha256").update(themeInitScript).digest("base64")}'`;

// CSP estricta del panel: solo se ejecutan scripts con el nonce de esta petición (y los
// que ellos carguen, por 'strict-dynamic'). El resto del sitio usa la CSP de next.config.ts.
function adminCsp(nonce: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${themeScriptHash} https://challenges.cloudflare.com${isDev ? " 'unsafe-eval'" : ""}`,
    // Estilos en línea: los usan el editor y los componentes; no pueden ejecutar código.
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' blob: data: ${supabaseUrl}`,
    "font-src 'self'",
    `connect-src 'self' ${supabaseUrl} ${supabaseUrl.replace(/^https:/, "wss:")}`,
    "frame-src https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

// Refresca la sesión de Supabase en el panel y redirige al login si no hay usuario.
// Es solo una verificación optimista: cada página y acción del panel vuelve a validar
// que el usuario sea administrador (y RLS lo exige en la base de datos).
export async function proxy(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return new NextResponse("Supabase no está configurado.", { status: 503 });
  }

  const csp = adminCsp(Buffer.from(crypto.randomUUID()).toString("base64"));
  // Next lee la CSP de la petición para poner el nonce en sus propios scripts.
  const forward = () => {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Content-Security-Policy", csp);
    return NextResponse.next({ request: { headers: requestHeaders } });
  };

  let response = forward();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = forward();
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!data?.claims && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
