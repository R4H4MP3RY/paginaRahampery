import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, WhatsappIcon } from "@hugeicons/core-free-icons";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs, CtaBand, FaqList, SectionHeading } from "@/components/sections";
import { buttonVariants } from "@/components/ui/button";
import { getServicePage, servicePages } from "@/content/servicios";
import { services, site, whatsappUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/servicios/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  return {
    title: { absolute: `${page.metaTitle} | ${site.name}` },
    description: page.metaDescription,
    alternates: { canonical: `/servicios/${slug}` },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url: `/servicios/${slug}` },
  };
}

export default async function ServicePage({ params }: PageProps<"/servicios/[slug]">) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();
  const offers = services.filter((s) => s.audience === page.audience);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: page.metaTitle,
          description: page.metaDescription,
          url: `${site.url}/servicios/${slug}`,
          provider: { "@id": `${site.url}/#negocio` },
          areaServed: { "@type": "Country", name: "México" },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: page.eyebrow,
            itemListElement: offers.map((s) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: s.name, description: s.summary },
              description: s.price,
              priceCurrency: "MXN",
            })),
          },
        }}
      />

      <section className="bg-brand-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 md:py-20">
          <Breadcrumbs tone="dark" items={[{ name: page.navLabel, href: `/servicios/${slug}` }]} />
          <div className="grid max-w-3xl gap-4">
            <p className="text-brand-orange text-sm font-semibold tracking-wide uppercase">{page.eyebrow}</p>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">{page.h1}</h1>
            <p className="text-lg text-pretty text-white/80">{page.intro}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl(page.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "whatsapp", size: "xl" })}
            >
              <HugeiconsIcon icon={WhatsappIcon} />
              Agenda tu cita por WhatsApp
            </a>
            <a href="#precios" className={buttonVariants({ variant: "outline-inverse", size: "xl" })}>
              Ver precios
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Lo que resolvemos" title={page.problemsTitle} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {page.problems.map((p) => (
            <li key={p.title} className="bg-card grid content-start gap-2 rounded-2xl border p-6">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-muted-foreground">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="precios" className="bg-muted">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Precios" title="Elige cómo quieres empezar" />
          <ul className="grid gap-6 md:grid-cols-2">
            {offers.map((s) => (
              <li key={s.slug} className="bg-card grid content-start gap-4 rounded-2xl border p-8">
                <h3 className="text-xl font-semibold">{s.name}</h3>
                <p className="text-brand-blue text-2xl font-semibold">{s.price}</p>
                <p className="text-muted-foreground">{s.summary}</p>
                <a
                  href={whatsappUrl(`Hola, me interesa: ${s.name}. ${site.whatsapp.message}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ size: "xl", className: "justify-self-start" })}
                >
                  Me interesa
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <SectionHeading eyebrow="El proceso" title={page.processTitle} />
        <ul className="grid content-start gap-3">
          {page.process.map((item) => (
            <li key={item} className="flex gap-3 text-lg">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} className="text-brand-green mt-1 shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-muted">
        <div className="mx-auto grid max-w-3xl gap-8 px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas" />
          <FaqList faqs={page.faqs} />
        </div>
      </section>

      <CtaBand message={page.whatsappMessage} />
    </>
  );
}
