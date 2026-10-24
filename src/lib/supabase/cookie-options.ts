import type { CookieOptionsWithName } from "@supabase/ssr";

// Cookies de sesión: solo por HTTPS en producción y sin enviarse desde otros sitios.
// (No pueden ser httpOnly: el cliente del navegador del panel necesita leerlas.)
export const cookieOptions: CookieOptionsWithName = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};
