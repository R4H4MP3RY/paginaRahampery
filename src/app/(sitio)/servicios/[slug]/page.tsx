import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { JsonLd } from "@/components/json-ld";
import {
  Breadcrumbs,
  CtaBand,
  FaqList,
  Hero,
  IconTile,
  Section,
  SectionHeading,
  cardCls,
  container,
} from "@/components/sections";
import { buttonVariants } from "@/components/ui/button";
import { getServicePage, servicePages } from "@/content/servicios";
import { services, site, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

const tones = ["info", "money", "energy"] as const;

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

      <Hero>
        <div className="grid gap-6">
          <Breadcrumbs items={[{ name: page.navLabel, href: `/servicios/${slug}` }]} />
          <SectionHeading as="h1" eyebrow={page.eyebrow} title={page.h1} text={page.intro} className="max-w-[60rem]" />
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappUrl(page.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "accent", size: "xl" })}
            >
              <HugeiconsIcon icon={Calendar03Icon} />
              Agenda tu cita
            </a>
            <a href="#precios" className={buttonVariants({ variant: "outline", size: "xl" })}>
              Ver precios
            </a>
          </div>
        </div>
      </Hero>

      <Section>
        <div className={cn(container, "grid gap-10")}>
          <SectionHeading eyebrow="Lo que resolvemos" title={page.problemsTitle} />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {page.problems.map((p, i) => (
              <li key={p.title} className={cardCls}>
                <IconTile icon={CheckmarkCircle02Icon} tone={tones[i % tones.length]} />
                <h3 className="text-rc-lg">{p.title}</h3>
                <p className="text-rc-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="precios" tint>
        <div className={cn(container, "grid gap-10")}>
          <SectionHeading eyebrow="Precios" title="Elige cómo quieres empezar" />
          <ul className="grid gap-6 md:grid-cols-2">
            {offers.map((s) => (
              <li key={s.slug} className={cn(cardCls, "gap-4 p-8")}>
                <h3 className="text-rc-xl">{s.name}</h3>
                <p className="text-rc-money text-rc-xl font-semibold tabular-nums">{s.price}</p>
                <p className="text-rc-muted">{s.summary}</p>
                <a
                  href={whatsappUrl(`Hola, me interesa: ${s.name}. ${site.whatsapp.message}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ className: "mt-auto self-start" })}
                >
                  Me interesa
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className={cn(container, "grid gap-10 lg:grid-cols-2")}>
          <SectionHeading eyebrow="El proceso" title={page.processTitle} />
          <ol className="grid content-start gap-4">
            {page.process.map((item, i) => (
              <li key={item} className="flex gap-4">
                <span className="bg-rc-accent text-rc-on-accent flex size-9 shrink-0 items-center justify-center rounded-full font-semibold">
                  {i + 1}
                </span>
                <span className="text-rc-muted pt-1">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tint>
        <div className="mx-auto grid w-full max-w-3xl gap-8 px-6">
          <SectionHeading eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas" />
          <FaqList faqs={page.faqs} />
        </div>
      </Section>

      <CtaBand message={page.whatsappMessage} />
    </>
  );
}
