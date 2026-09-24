import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/post-card";
import { Breadcrumbs, CtaBand } from "@/components/sections";
import { blogDateFmt, getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { legalDisclaimer, site } from "@/lib/site";

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
        <header className="mx-auto grid max-w-3xl gap-5 px-4 pt-12 sm:px-6 md:pt-16">
          <Breadcrumbs items={[{ name: "Blog", href: "/blog" }, { name: post.title, href: `/blog/${slug}` }]} />
          <p className="text-muted-foreground text-sm">
            {post.category && <span className="text-brand-orange-ink font-semibold">{post.category} · </span>}
            <time dateTime={post.publishedAt}>{blogDateFmt.format(new Date(post.publishedAt))}</time> · Por {site.name}
          </p>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="text-muted-foreground text-xl text-pretty">{post.excerpt}</p>}
        </header>

        {post.coverUrl && (
          <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6">
            <div className="bg-secondary relative aspect-[1.91/1] overflow-hidden rounded-2xl">
              <Image src={post.coverUrl} alt={post.coverAlt ?? ""} fill priority sizes="(min-width: 1024px) 64rem, 100vw" className="object-cover" />
            </div>
          </div>
        )}

        {/* HTML sanitizado en el servidor al guardar (ver src/lib/editor/render.ts). */}
        <div
          className="prose prose-lg prose-slate prose-a:text-brand-blue prose-headings:tracking-tight prose-img:rounded-xl mx-auto max-w-3xl px-4 py-12 sm:px-6"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <p className="text-muted-foreground mx-auto max-w-3xl px-4 pb-12 text-xs sm:px-6">{legalDisclaimer}</p>
      </article>

      {more.length > 0 && (
        <section className="bg-muted">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-semibold">Sigue leyendo</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
