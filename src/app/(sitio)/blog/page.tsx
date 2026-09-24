import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { Breadcrumbs, CtaBand, Hero, Section, SectionHeading, container } from "@/components/sections";
import { getPublishedPosts } from "@/lib/blog";
import { site } from "@/lib/site";

export const revalidate = 3600;

const description =
  "Artículos de educación financiera: cómo salir de deudas, ahorrar, invertir, planear tu retiro y proteger a tu familia. Por Rahampery Contreras, coach financiero.";

export const metadata: Metadata = {
  title: "Blog de finanzas personales",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title: `Blog de finanzas personales | ${site.name}`, description, url: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Hero>
        <div className="grid gap-6">
          <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />
          <SectionHeading
            as="h1"
            eyebrow="Educación financiera"
            title="Aprende a aprovechar, proteger y hacer crecer tu dinero"
            text="Consejos prácticos, explicados paso a paso y sin tecnicismos."
          />
        </div>
      </Hero>

      <Section>
        <div className={container}>
          {posts.length === 0 ? (
            <p className="bg-rc-surface text-rc-lg text-rc-muted rounded-card p-10 text-center">
              Muy pronto publicaré los primeros artículos. ¡Vuelve pronto!
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          )}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
