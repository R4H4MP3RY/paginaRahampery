import Image from "next/image";
import Link from "next/link";
import { Chip, cardCls, cardHoverCls } from "@/components/sections";
import { blogDateFmt, type PublicPostSummary } from "@/lib/blog";
import { cn } from "@/lib/utils";

export function PostCard({ post }: { post: PublicPostSummary }) {
  return (
    <article className={cn(cardCls, cardHoverCls, "group relative")}>
      <div className="bg-rc-surface-2 relative aspect-video overflow-hidden rounded-2xl">
        {post.coverUrl && (
          <Image
            src={post.coverUrl}
            alt={post.coverAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="text-rc-xs text-rc-muted flex flex-wrap items-center gap-2">
        {post.category && <Chip>{post.category}</Chip>}
        <time dateTime={post.publishedAt}>{blogDateFmt.format(new Date(post.publishedAt))}</time>
      </div>
      <h3 className="text-rc-lg">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:underline">
          {post.title}
        </Link>
      </h3>
      {post.excerpt && <p className="text-rc-sm text-rc-muted line-clamp-3">{post.excerpt}</p>}
    </article>
  );
}
