import "server-only";
import { createClient } from "@supabase/supabase-js";

export const BLOG_TAG = "blog";

// Cliente sin sesión para leer contenido público (RLS: solo artículos publicados).
// Sus peticiones quedan en caché con la etiqueta "blog" para que las páginas sigan
// siendo estáticas; el panel invalida esa etiqueta al guardar.
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 3600, tags: [BLOG_TAG] } }),
    },
  });
}

export function publicImageUrl(path: string | null | undefined) {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog/${path}`;
}
