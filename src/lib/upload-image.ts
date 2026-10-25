import { createClient } from "@supabase/supabase-js";
import { createBlogImageUpload } from "@/lib/actions/uploads";

// Cliente sin sesión: la subida se autoriza con el permiso firmado que entrega el servidor.
const storage = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
}).storage;

// Sube una imagen al bucket "blog" y devuelve su ruta y URL pública.
export async function uploadBlogImage(file: File) {
  const upload = await createBlogImageUpload({ type: file.type, size: file.size });
  if (!upload.ok) throw new Error(upload.message);

  const { error } = await storage
    .from("blog")
    .uploadToSignedUrl(upload.path, upload.token, file, { cacheControl: "31536000", contentType: file.type });
  if (error) throw new Error("No se pudo subir la imagen.");

  return { path: upload.path, url: upload.url };
}
