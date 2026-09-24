import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, InformationCircleIcon, WhatsappIcon } from "@hugeicons/core-free-icons";
import { JsonLd } from "@/components/json-ld";
import { QuoteForm } from "@/components/quote-form";
import {
  Breadcrumbs,
  CtaBand,
  FaqList,
  Hero,
  IconTile,
  InsurersStrip,
  Section,
  SectionHeading,
  cardCls,
  cardHoverCls,
  container,
} from "@/components/sections";
import { buttonVariants } from "@/components/ui/button";
import { getInsurancePage, insurancePages } from "@/content/seguros";
import { fallbackInsuranceIcon, insuranceIcons } from "@/lib/insurance-icons";
import { insuranceCategories, offeredInsurances, site, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

// Solo se generan páginas de seguros que se ofrecen y tienen contenido.
export function generateStaticParams() {
  return insurancePages
    .filter((p) => offeredInsurances.some((i) => i.slug === p.slug))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/seguros/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getInsurancePage(slug);
  if (!page) return {};
  return {
    title: { absolute: `${page.metaTitle} | ${site.name}` },
    description: page.metaDescription,
    alternates: { canonical: `/seguros/${slug}` },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url: `/seguros/${slug}` },
  };
}

export default async function InsurancePage({ params }: PageProps<"/seguros/[slug]">) {
  const { slug } = await params;
  const page = getInsurancePage(slug);
  const insurance = offeredInsurances.find((i) => i.slug === slug);
  if (!page || !insurance) notFound();

  const related = offeredInsurances.filter((i) => i.category === insurance.category && i.slug !== slug);
  const quoteMessage = `Hola, quiero cotizar: ${insurance.name}.`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: insurance.name,
          serviceType: insurance.keyword,
          description: page.metaDescription,
          url: `${site.url}/seguros/${slug}`,
          provider: { "@id": `${site.url}/#negocio` },
          areaServed: { "@type": "Country", name: "México" },
        }}
      />

      <Hero>
        <div className="grid gap-6">
          <Breadcrumbs items={[{ name: "Seguros", href: "/seguros" }, { name: insurance.name, href: `/seguros/${slug}` }]} />
          <div className="flex items-start gap-5">
            <span className="hidden sm:block">
              <IconTile icon={insuranceIcons[slug] ?? fallbackInsuranceIcon} />
            </span>
            <SectionHeading as="h1" eyebrow={insuranceCategories[insurance.category]} title={page.h1} text={page.intro} />
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#cotizar" className={buttonVariants({ size: "xl" })}>
              Cotizar gratis
            </a>
            <a
              href={whatsappUrl(quoteMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "xl" })}
            >
              <HugeiconsIcon icon={WhatsappIcon} />
              Pregúntame por WhatsApp
            </a>
          </div>
        </div>
      </Hero>

      <Section>
        <div className={cn(container, "grid gap-12 lg:grid-cols-[1fr_26rem]")}>
          <div className="grid content-start gap-12">
            <ContentList title="¿Para quién es?" items={page.forWhom} />
            <ContentList title="¿Qué cubre?" items={page.covers} />
            <ContentList title="Qué debes considerar" items={page.considerations} />

            <section className="grid gap-5">
              <h2 className="text-rc-xl">Preguntas frecuentes</h2>
              <FaqList faqs={page.faqs} />
            </section>

            {/* .rc-note */}
            <p className="bg-rc-info-soft text-rc-sm text-rc-text flex gap-3 rounded-xl px-5 py-4">
              <HugeiconsIcon icon={InformationCircleIcon} size={22} className="text-rc-primary mt-0.5 shrink-0" />
              Información general con fines educativos. Las coberturas, exclusiones, periodos de espera y condiciones
              dependen de cada aseguradora y se detallan en las condiciones generales de la póliza.
            </p>
          </div>

          <aside id="cotizar" className="lg:sticky lg:top-28 lg:self-start">
            <div className={cn(cardCls, "shadow-rc-2 gap-1")}>
              <h2 className="text-rc-xl">Solicita tu cotización</h2>
              <p className="text-rc-sm text-rc-muted mb-5">
                {insurance.name}: gratis y sin compromiso. Te respondo con opciones.
              </p>
              <QuoteForm defaultInsurance={slug} />
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tint>
          <div className={cn(container, "grid gap-6")}>
            <h2 className="text-rc-xl">También te puede interesar</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/seguros/${r.slug}`}
                    className={cn(cardCls, cardHoverCls, "text-rc-heading flex-row items-center font-semibold")}
                  >
                    <IconTile icon={insuranceIcons[r.slug] ?? fallbackInsuranceIcon} />
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <InsurersStrip />
      <CtaBand
        title="¿Tienes dudas sobre qué seguro necesitas?"
        text="Te ayudo a revisar tu situación y elegir la protección adecuada."
        message={quoteMessage}
      />
    </>
  );
}

function ContentList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="grid gap-5">
      <h2 className="text-rc-xl">{title}</h2>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} className="text-rc-money mt-0.5 shrink-0" />
            <span className="text-rc-text">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
