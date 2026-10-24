import "server-only";
import { sanitizePostHtml } from "@/lib/editor/sanitize";
import { createPublicClient, publicImageUrl } from "@/lib/supabase/public";

export type PublicPostSummary = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  coverUrl: string | null;
  coverAlt: string | null;
  publishedAt: string;
  updatedAt: string;
};

export type PublicPost = PublicPostSummary & {
  contentHtml: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

type Row = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  cover_path: string | null;
  cover_alt: string | null;
  published_at: string;
  updated_at: string;
  content_html?: string;
  seo_title?: string | null;
  seo_description?: string | null;
};

const summaryColumns = "slug, title, excerpt, category, cover_path, cover_alt, published_at, updated_at";

function toSummary(r: Row): PublicPostSummary {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    category: r.category,
    coverUrl: publicImageUrl(r.cover_path),
    coverAlt: r.cover_alt,
    publishedAt: r.published_at,
    updatedAt: r.updated_at,
  };
}

// RLS ya limita a artículos publicados; el filtro explícito lo hace evidente.
export async function getPublishedPosts(limit = 100): Promise<PublicPostSummary[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select(summaryColumns)
    .eq("status", "publicado")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getPublishedPosts", error.code, error.message);
    return [];
  }
  return (data as Row[]).map(toSummary);
}

export async function getPostBySlug(slug: string): Promise<PublicPost | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("posts")
    .select(`${summaryColumns}, content_html, seo_title, seo_description`)
    .eq("status", "publicado")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  const r = data as Row;
  return { ...toSummary(r), contentHtml: sanitizePostHtml(r.content_html ?? ""), seoTitle: r.seo_title ?? null, seoDescription: r.seo_description ?? null };
}

export const blogDateFmt = new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeZone: "America/Mexico_City" });
