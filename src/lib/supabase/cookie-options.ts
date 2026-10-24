import type { CookieOptionsWithName } from "@supabase/ssr";

// Cookies de sesión: solo por HTTPS en producción y sin enviarse desde otros sitios.
// No pueden ser httpOnly (el cliente del navegador del panel necesita leerlas), así que
// se limitan a /admin: los scripts de las páginas públicas no pueden verlas.
export const cookieOptions: CookieOptionsWithName = {
  path: "/admin",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};
