import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, InformationCircleIcon, WhatsappIcon } from "@hugeicons/core-free-icons";
import { JsonLd } from "@/components/json-ld";
import { QuoteForm } from "@/components/quote-form";
import { Breadcrumbs, CtaBand, FaqList, InsurersStrip, SectionHeading } from "@/components/sections";
import { buttonVariants } from "@/components/ui/button";
import { getInsurancePage, insurancePages } from "@/content/seguros";
import { fallbackInsuranceIcon, insuranceIcons } from "@/lib/insurance-icons";
import { insuranceCategories, offeredInsurances, site, whatsappUrl } from "@/lib/site";

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

      <section className="bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:py-16">
          <Breadcrumbs items={[{ name: "Seguros", href: "/seguros" }, { name: insurance.name, href: `/seguros/${slug}` }]} />
          <div className="flex items-start gap-4">
            <span className="text-brand-blue hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-white sm:flex">
              <HugeiconsIcon icon={insuranceIcons[slug] ?? fallbackInsuranceIcon} size={30} />
            </span>
            <SectionHeading as="h1" eyebrow={insuranceCategories[insurance.category]} title={page.h1} text={page.intro} />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#cotizar" className={buttonVariants({ size: "xl" })}>
              Cotizar gratis
            </a>
            <a
              href={whatsappUrl(quoteMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "whatsapp", size: "xl" })}
            >
              <HugeiconsIcon icon={WhatsappIcon} />
              Pregúntame por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_26rem]">
        <div className="grid content-start gap-12">
          <ContentList title="¿Para quién es?" items={page.forWhom} />
          <ContentList title="¿Qué cubre?" items={page.covers} />
          <ContentList title="Qué debes considerar" items={page.considerations} />

          <section className="grid gap-4">
            <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
            <FaqList faqs={page.faqs} />
          </section>

          <p className="text-muted-foreground flex gap-2 text-sm">
            <HugeiconsIcon icon={InformationCircleIcon} size={18} className="mt-0.5 shrink-0" />
            Información general con fines educativos. Las coberturas, exclusiones, periodos de espera y condiciones
            dependen de cada aseguradora y se detallan en las condiciones generales de la póliza.
          </p>
        </div>

        <aside id="cotizar" className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-card rounded-2xl border p-6 shadow-sm">
            <h2 className="mb-1 text-xl font-semibold">Solicita tu cotización</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              {insurance.name}: gratis y sin compromiso. Te respondo con opciones.
            </p>
            <QuoteForm defaultInsurance={slug} />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 sm:px-6">
          <h2 className="text-xl font-semibold">También te puede interesar</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/seguros/${r.slug}`}
                  className="hover:border-brand-blue flex items-center gap-3 rounded-xl border p-4 font-medium transition-colors"
                >
                  <HugeiconsIcon icon={insuranceIcons[r.slug] ?? fallbackInsuranceIcon} size={22} className="text-brand-blue" />
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
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
    <section className="grid gap-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-lg">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} className="text-brand-green mt-1 shrink-0" />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
