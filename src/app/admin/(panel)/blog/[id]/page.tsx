import Link from "next/link";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon } from "@hugeicons/core-free-icons";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { PostForm } from "@/components/admin/post-form";
import { requireAdmin } from "@/lib/auth";
import type { PostRecord } from "@/lib/blog-schema";

export default async function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const { data } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, category, content_json, cover_path, cover_alt, seo_title, seo_description, status, published_at, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const post = data as PostRecord;
  const coverUrl = post.cover_path ? supabase.storage.from("blog").getPublicUrl(post.cover_path).data.publicUrl : null;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <Link href="/admin/blog" className="text-muted-foreground text-sm hover:underline">
            ← Blog
          </Link>
          <h1 className="text-2xl font-semibold">Editar artículo</h1>
        </div>
        <div className="flex items-center gap-2">
          {post.status === "publicado" && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="text-rc-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            >
              <HugeiconsIcon icon={ViewIcon} size={18} />
              Ver en el sitio
            </Link>
          )}
          <DeletePostButton id={post.id} />
        </div>
      </div>
      <PostForm post={post} coverUrl={coverUrl} />
    </div>
  );
}
