import { z } from "zod";

export const postIntents = ["guardar", "publicar", "despublicar"] as const;

export const postSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(3, "El título es muy corto").max(160),
  slug: z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Usa solo minúsculas, números y guiones"),
  excerpt: z.string().trim().max(300, "Máximo 300 caracteres").optional(),
  category: z.string().trim().max(60).optional(),
  coverPath: z
    .string()
    .regex(/^\d{4}\/[a-f0-9-]{36}\.(jpg|jpeg|png|webp|avif)$/)
    .optional(),
  coverAlt: z.string().trim().max(200).optional(),
  seoTitle: z.string().trim().max(70, "Máximo 70 caracteres").optional(),
  seoDescription: z.string().trim().max(170, "Máximo 170 caracteres").optional(),
  content: z.string().max(500_000, "El artículo es demasiado largo"),
  intent: z.enum(postIntents),
});

export type PostFormState = {
  ok?: boolean;
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof postSchema>, string[]>>;
};

export type PostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  content_json: unknown;
  cover_path: string | null;
  cover_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: "borrador" | "publicado";
  published_at: string | null;
  updated_at: string;
};

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
}
