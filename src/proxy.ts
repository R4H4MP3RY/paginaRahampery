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

// Antes del commit ec1a9ce las cookies de sesión usaban Path=/. Esas copias viejas no se
// borran al cerrar sesión (ahora se usa Path=/admin) y el navegador las sigue enviando,
// así que se expiran aquí. Se puede quitar después de 2026-12-31.
// Se agrega al final con headers.append para no reemplazar las cookies de /admin del mismo nombre.
// Solo al abrir /admin/login como página normal: en una Server Action que redirige, Next
// mezcla las Set-Cookie de la respuesta con las cookies del pedido por nombre (sin ver la
// ruta), y este borrado vaciaría la sesión al preparar la página siguiente.
function expireLegacySessionCookies(request: NextRequest, res: NextResponse) {
  const isLoginPageLoad =
    request.method === "GET" && request.nextUrl.pathname === "/admin/login" && !request.headers.has("next-action");
  if (!isLoginPageLoad) return res;

  for (const { name } of request.cookies.getAll()) {
    if (/^sb-.+-auth-token(\.\d+)?$/.test(name)) {
      res.headers.append("Set-Cookie", `${name}=; Path=/; Max-Age=0; SameSite=Lax${isDev ? "" : "; Secure"}`);
    }
  }
  return res;
}

// Refresca la sesión de Supabase en el panel y redirige al login si no hay usuario.
// Es solo una verificación optimista: cada página y acción del panel vuelve a validar
// que el usuario sea administrador (y RLS lo exige en la base de datos).
export async function proxy(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return new NextResponse("Supabase no está configurado.", {
      status: 503,
      headers: { "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'" },
    });
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
    const redirect = NextResponse.redirect(new URL("/admin/login", request.url));
    // Conserva las cookies que Supabase haya renovado o borrado (p. ej. una sesión vencida).
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    redirect.headers.set("Content-Security-Policy", csp);
    return expireLegacySessionCookies(request, redirect);
  }
  response.headers.set("Content-Security-Policy", csp);
  return expireLegacySessionCookies(request, response);
}

export const config = {
  matcher: ["/admin/:path*"],
};
