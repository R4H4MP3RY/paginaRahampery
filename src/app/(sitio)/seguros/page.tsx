import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { QuoteForm } from "@/components/quote-form";
import {
  Breadcrumbs,
  CtaBand,
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
import { insurancePages } from "@/content/seguros";
import { categoryIcons, fallbackInsuranceIcon, insuranceIcons } from "@/lib/insurance-icons";
import { insuranceCategories, offeredInsurances, site, type InsuranceCategory } from "@/lib/site";
import { cn } from "@/lib/utils";

const categoryTones: Record<InsuranceCategory, "info" | "money" | "energy"> = {
  salud: "info",
  patrimonio: "info",
  retiro: "money",
  empresa: "energy",
};

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
      <Hero>
        <div className="grid gap-6">
          <Breadcrumbs items={[{ name: "Seguros", href: "/seguros" }]} />
          <SectionHeading
            as="h1"
            eyebrow="Seguros y retiro"
            title="Protege a tu familia, tu patrimonio y tu retiro"
            text={`Soy agente de seguros por cuenta propia con cédula CNSF ${site.cnsf.cedula}. Comparo opciones de varias aseguradoras para encontrar la protección adecuada para ti. La cotización es gratuita.`}
          />
          <div>
            <a href="#cotizar" className={buttonVariants({ size: "xl" })}>
              Cotizar gratis
            </a>
          </div>
        </div>
      </Hero>

      <Section>
        <div className={cn(container, "grid gap-14")}>
          {categories.map((c) => (
            <section key={c.id} aria-labelledby={`cat-${c.id}`} className="grid gap-6">
              <h2 id={`cat-${c.id}`} className="text-rc-xl flex items-center gap-3">
                <HugeiconsIcon icon={categoryIcons[c.id]} size={26} className="text-rc-primary" />
                {insuranceCategories[c.id]}
              </h2>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {c.items.map((i) => {
                  const page = insurancePages.find((p) => p.slug === i.slug)!;
                  return (
                    <li key={i.slug}>
                      <Link href={`/seguros/${i.slug}`} className={cn(cardCls, cardHoverCls, "group h-full")}>
                        <IconTile icon={insuranceIcons[i.slug] ?? fallbackInsuranceIcon} tone={categoryTones[c.id]} />
                        <h3 className="text-rc-lg">{i.name}</h3>
                        <p className="text-rc-sm text-rc-muted line-clamp-3">{page.intro}</p>
                        <span className="text-rc-primary text-rc-sm mt-auto inline-flex items-center gap-1 pt-2 font-semibold">
                          Ver más
                          <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={16}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      <InsurersStrip />

      <Section id="cotizar" tint>
        <div className={cn(container, "grid gap-10 lg:grid-cols-[1fr_1.05fr]")}>
          <SectionHeading
            eyebrow="Cotización gratuita"
            title="Cuéntame qué necesitas y te envío opciones"
            text="¿Ya tienes seguros y quieres saber si te convienen? Revisamos tus pólizas y buscamos mejores opciones en una consultoría de $350 MXN por hora."
          />
          <div className={cn(cardCls, "shadow-rc-2 p-6 sm:p-8")}>
            <QuoteForm />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
