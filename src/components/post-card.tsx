import Image from "next/image";
import Link from "next/link";
import { blogDateFmt, type PublicPostSummary } from "@/lib/blog";

export function PostCard({ post }: { post: PublicPostSummary }) {
  return (
    <article className="group bg-card relative grid content-start overflow-hidden rounded-2xl border">
      <div className="bg-secondary relative aspect-[1.91/1]">
        {post.coverUrl && (
          <Image
            src={post.coverUrl}
            alt={post.coverAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}
      </div>
      <div className="grid gap-2 p-6">
        <p className="text-muted-foreground text-sm">
          {post.category && <span className="text-brand-orange-ink font-semibold">{post.category} · </span>}
          <time dateTime={post.publishedAt}>{blogDateFmt.format(new Date(post.publishedAt))}</time>
        </p>
        <h3 className="text-lg leading-snug font-semibold">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:underline">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>}
      </div>
    </article>
  );
}
