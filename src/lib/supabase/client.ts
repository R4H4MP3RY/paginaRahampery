import { createBrowserClient } from "@supabase/ssr";

// Cliente del navegador (panel de administración). Respeta RLS.
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
}
