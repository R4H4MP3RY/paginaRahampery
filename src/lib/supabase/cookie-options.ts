import type { CookieOptionsWithName } from "@supabase/ssr";

// Cookies de sesión del panel:
// - httpOnly: ningún script del navegador puede leerlas (las imágenes del blog se suben
//   con un permiso firmado que entrega el servidor, sin usar la sesión).
// - path /admin: el navegador solo las envía al panel.
// - secure en producción (solo HTTPS) y sameSite lax (no se envían desde otros sitios).
export const cookieOptions: CookieOptionsWithName = {
  path: "/admin",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};
