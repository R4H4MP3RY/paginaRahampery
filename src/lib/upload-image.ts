import { createClient } from "@/lib/supabase/client";

const allowed: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const MAX_BYTES = 5 * 1024 * 1024;

// Sube una imagen al bucket "blog" (RLS: solo administradores) y devuelve su ruta y URL pública.
export async function uploadBlogImage(file: File) {
  const ext = allowed[file.type];
  if (!ext) throw new Error("Formato no permitido. Usa JPG, PNG, WEBP o AVIF.");
  if (file.size > MAX_BYTES) throw new Error("La imagen pesa más de 5 MB.");

  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from("blog")
    .upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
  if (error) throw new Error("No se pudo subir la imagen.");

  const { data } = supabase.storage.from("blog").getPublicUrl(path);
  return { path, url: data.publicUrl };
}
