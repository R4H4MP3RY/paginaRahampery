import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { Breadcrumbs, CtaBand, SectionHeading } from "@/components/sections";
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
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:py-16">
          <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />
          <SectionHeading
            as="h1"
            eyebrow="Blog"
            title="Educación financiera para tomar mejores decisiones"
            text="Consejos prácticos para aprovechar, proteger y hacer crecer tu dinero."
          />
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        {posts.length === 0 ? (
          <p className="text-muted-foreground rounded-2xl border p-10 text-center text-lg">
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

      <CtaBand />
    </>
  );
}
