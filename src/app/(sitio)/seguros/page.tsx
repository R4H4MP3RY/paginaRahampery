import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { QuoteForm } from "@/components/quote-form";
import { Breadcrumbs, CtaBand, InsurersStrip, SectionHeading } from "@/components/sections";
import { insurancePages } from "@/content/seguros";
import { categoryIcons, fallbackInsuranceIcon, insuranceIcons } from "@/lib/insurance-icons";
import { insuranceCategories, offeredInsurances, site, type InsuranceCategory } from "@/lib/site";

const description =
  "Seguros de vida, gastos médicos, auto, hogar y planes de retiro (PPR). Comparo opciones de las principales aseguradoras. Cotización gratuita con agente certificado por la CNSF.";

export const metadata: Metadata = {
  title: "Seguros y planes de retiro · Cotiza gratis",
  description,
  alternates: { canonical: "/seguros" },
  openGraph: { title: `Seguros y planes de retiro | ${site.name}`, description, url: "/seguros" },
};

export default function SegurosPage() {
  const categories = (Object.keys(insuranceCategories) as InsuranceCategory[])
    .map((c) => ({
      id: c,
      items: offeredInsurances.filter((i) => i.category === c && insurancePages.some((p) => p.slug === i.slug)),
    }))
    .filter((c) => c.items.length > 0);

  return (
    <>
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:py-16">
          <Breadcrumbs items={[{ name: "Seguros", href: "/seguros" }]} />
          <SectionHeading
            as="h1"
            eyebrow="Seguros y retiro"
            title="Protege a tu familia, tu patrimonio y tu retiro"
            text={`Soy agente de seguros por cuenta propia con cédula CNSF ${site.cnsf.cedula}. Comparo opciones de varias aseguradoras para encontrar la protección adecuada para ti. La cotización es gratuita.`}
          />
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6">
        {categories.map((c) => (
          <section key={c.id} aria-labelledby={`cat-${c.id}`} className="grid gap-5">
            <h2 id={`cat-${c.id}`} className="flex items-center gap-2 text-2xl font-semibold">
              <HugeiconsIcon icon={categoryIcons[c.id]} size={26} className="text-brand-blue" />
              {insuranceCategories[c.id]}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.items.map((i) => {
                const page = insurancePages.find((p) => p.slug === i.slug)!;
                return (
                  <li key={i.slug}>
                    <Link
                      href={`/seguros/${i.slug}`}
                      className="group bg-card hover:border-brand-blue grid h-full content-start gap-3 rounded-2xl border p-6 transition-colors"
                    >
                      <span className="bg-secondary text-brand-blue flex size-12 items-center justify-center rounded-xl">
                        <HugeiconsIcon icon={insuranceIcons[i.slug] ?? fallbackInsuranceIcon} size={26} />
                      </span>
                      <h3 className="text-lg font-semibold">{i.name}</h3>
                      <p className="text-muted-foreground line-clamp-3">{page.intro}</p>
                      <span className="text-brand-blue inline-flex items-center gap-1 text-sm font-semibold">
                        Ver más
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <InsurersStrip />

      <section id="cotizar" className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.05fr]">
        <SectionHeading
          eyebrow="Cotización gratuita"
          title="Cuéntame qué necesitas y te envío opciones"
          text="¿Ya tienes seguros y quieres saber si te convienen? Revisamos tus pólizas y buscamos mejores opciones en una consultoría de $350 MXN por hora."
        />
        <div className="bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
          <QuoteForm />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
