import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/post-card";
import { Breadcrumbs, Chip, CtaBand, Section, container } from "@/components/sections";
import { blogDateFmt, getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { legalDisclaimer, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

// Se prerenderizan los artículos existentes; los nuevos se generan al primer visitante.
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || undefined;
  return {
    title: { absolute: `${title} | ${site.name}` },
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [site.name],
      ...(post.coverUrl && { images: [{ url: post.coverUrl, alt: post.coverAlt ?? "" }] }),
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const more = (await getPublishedPosts(4)).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.seoDescription || post.excerpt || undefined,
          image: post.coverUrl ?? undefined,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          inLanguage: "es-MX",
          mainEntityOfPage: `${site.url}/blog/${slug}`,
          author: { "@id": `${site.url}/#persona` },
          publisher: { "@id": `${site.url}/#negocio` },
        }}
      />

      <article>
        <header className="from-rc-surface to-rc-bg bg-linear-to-b pt-16 pb-10">
          <div className="mx-auto grid w-full max-w-3xl gap-5 px-6">
            <Breadcrumbs items={[{ name: "Blog", href: "/blog" }, { name: post.title, href: `/blog/${slug}` }]} />
            <p className="text-rc-sm text-rc-muted flex flex-wrap items-center gap-2">
              {post.category && <Chip>{post.category}</Chip>}
              <time dateTime={post.publishedAt}>{blogDateFmt.format(new Date(post.publishedAt))}</time>
              <span aria-hidden="true">·</span>
              <span>Por {site.name}</span>
            </p>
            <h1>{post.title}</h1>
            {post.excerpt && <p className="text-rc-lg text-rc-muted leading-relaxed text-pretty">{post.excerpt}</p>}
          </div>
        </header>

        {post.coverUrl && (
          <div className="mx-auto max-w-5xl px-6">
            <div className="bg-rc-surface-2 shadow-rc-2 relative aspect-[1.91/1] overflow-hidden rounded-cta">
              <Image
                src={post.coverUrl}
                alt={post.coverAlt ?? ""}
                fill
                priority
                sizes="(min-width: 1024px) 64rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* HTML sanitizado en el servidor al guardar (ver src/lib/editor/render.ts). */}
        <div
          className="prose prose-lg prose-rc mx-auto max-w-3xl px-6 py-12"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <p className="text-rc-xs text-rc-muted mx-auto max-w-3xl px-6 pb-12">{legalDisclaimer}</p>
      </article>

      {more.length > 0 && (
        <Section tint>
          <div className={cn(container, "grid gap-8")}>
            <h2>Sigue leyendo</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
