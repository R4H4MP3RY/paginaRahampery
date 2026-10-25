"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { logAdminEvent } from "@/lib/admin-log";

const BLOG_IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;
const MAX_BYTES = 5 * 1024 * 1024;

const requestSchema = z.object({
  type: z.enum(Object.keys(BLOG_IMAGE_TYPES) as [keyof typeof BLOG_IMAGE_TYPES, ...(keyof typeof BLOG_IMAGE_TYPES)[]]),
  size: z.number().int().positive().max(MAX_BYTES),
});

export type BlogImageUpload = { ok: true; path: string; token: string; url: string } | { ok: false; message: string };

// Crea un permiso de subida de un solo uso (válido 2 h) para una imagen del blog.
// Así el navegador sube directo a Supabase sin necesitar la sesión, que puede ser httpOnly.
// El bucket vuelve a validar formato y tamaño (migración 0002).
export async function createBlogImageUpload(input: { type: string; size: number }): Promise<BlogImageUpload> {
  const { supabase, userId } = await requireAdmin();
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Formato no permitido o la imagen pesa más de 5 MB. Usa JPG, PNG, WEBP o AVIF." };
  }

  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${BLOG_IMAGE_TYPES[parsed.data.type]}`;
  const bucket = supabase.storage.from("blog");
  const { data, error } = await bucket.createSignedUploadUrl(path);
  if (error) {
    console.error("blog image upload url", error.name, error.message);
    return { ok: false, message: "No se pudo preparar la subida de la imagen." };
  }

  await logAdminEvent("blog_image_upload", { userId, target: path });
  return { ok: true, path: data.path, token: data.token, url: bucket.getPublicUrl(data.path).data.publicUrl };
}
