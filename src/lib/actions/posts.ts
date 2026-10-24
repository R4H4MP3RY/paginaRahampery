"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { JSONContent } from "@tiptap/react";
import { requireAdmin } from "@/lib/auth";
import { postSchema, type PostFormState } from "@/lib/blog-schema";
import { renderPostHtml } from "@/lib/editor/render";
import { createAdminClient } from "@/lib/supabase/admin";
import { BLOG_TAG } from "@/lib/supabase/public";

const optional = (v: FormDataEntryValue | null) => (typeof v === "string" && v.trim() !== "" ? v : undefined);

export async function savePost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  const { supabase, userId } = await requireAdmin();

  const parsed = postSchema.safeParse({
    id: optional(formData.get("id")),
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: optional(formData.get("excerpt")),
    category: optional(formData.get("category")),
    coverPath: optional(formData.get("coverPath")),
    coverAlt: optional(formData.get("coverAlt")),
    seoTitle: optional(formData.get("seoTitle")),
    seoDescription: optional(formData.get("seoDescription")),
    content: formData.get("content") ?? "",
    intent: formData.get("intent"),
  });
  if (!parsed.success) {
    return { message: "Revisa los campos marcados.", errors: z.flattenError(parsed.error).fieldErrors };
  }
  const data = parsed.data;

  let doc: JSONContent;
  try {
    doc = JSON.parse(data.content) as JSONContent;
    if (doc?.type !== "doc") throw new Error("formato");
  } catch {
    return { message: "El contenido del artículo no es válido." };
  }

  const existing = data.id
    ? (await supabase.from("posts").select("slug, status, published_at").eq("id", data.id).single()).data
    : null;
  if (data.id && !existing) return { message: "El artículo ya no existe." };

  const status = data.intent === "publicar" ? "publicado" : data.intent === "despublicar" ? "borrador" : (existing?.status ?? "borrador");
  const publishedAt = status === "publicado" ? (existing?.published_at ?? new Date().toISOString()) : existing?.published_at ?? null;

  const row = {
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt ?? null,
    category: data.category ?? null,
    content_json: doc,
    content_html: renderPostHtml(doc),
    cover_path: data.coverPath ?? null,
    cover_alt: data.coverAlt ?? null,
    seo_title: data.seoTitle ?? null,
    seo_description: data.seoDescription ?? null,
    status,
    published_at: publishedAt,
  };

  // La sesión del administrador no puede escribir en posts (migración 0006): se guarda con
  // la secret key, ya verificado el administrador y con el HTML sanitizado aquí mismo.
  const admin = createAdminClient();
  const result = data.id
    ? await admin.from("posts").update(row).eq("id", data.id).select("id").single()
    : await admin.from("posts").insert({ ...row, author_id: userId }).select("id").single();

  if (result.error) {
    if (result.error.code === "23505") {
      return { message: "Ya existe un artículo con esa URL.", errors: { slug: ["Elige otra URL"] } };
    }
    console.error("save post", result.error);
    return { message: "No se pudo guardar. Inténtalo de nuevo." };
  }

  // Refresca el blog público (lista, artículo y sitemap) y el listado del panel.
  updateTag(BLOG_TAG);
  revalidatePath("/admin/blog", "layout");

  if (!data.id) redirect(`/admin/blog/${result.data.id}`);

  const messages = { guardar: "Cambios guardados.", publicar: "Artículo publicado.", despublicar: "Artículo despublicado." };
  return { ok: true, message: messages[data.intent] };
}

export async function deletePost(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return;

  const { error } = await supabase.from("posts").delete().eq("id", id.data);
  if (error) {
    console.error("delete post", error.code, error.message);
    return;
  }
  updateTag(BLOG_TAG);
  revalidatePath("/admin/blog", "layout");
  redirect("/admin/blog");
}
