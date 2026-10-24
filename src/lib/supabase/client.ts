import { createBrowserClient } from "@supabase/ssr";
import { cookieOptions } from "@/lib/supabase/cookie-options";

// Cliente del navegador (panel de administración). Respeta RLS.
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookieOptions,
  });
}
