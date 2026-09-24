import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { JsonLd } from "@/components/json-ld";
import { buttonVariants } from "@/components/ui/button";
import { insurers, site, whatsappUrl } from "@/lib/site";
import type { Faq } from "@/content/seguros";

export function SectionHeading({
  eyebrow,
  title,
  text,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="grid max-w-2xl gap-3">
      <p className="text-brand-orange-ink text-sm font-semibold tracking-wide uppercase">{eyebrow}</p>
      <Heading className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">{title}</Heading>
      {text && <p className="text-muted-foreground text-lg text-pretty">{text}</p>}
    </div>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="grid gap-3">
      {faqs.map((f) => (
        <details key={f.q} className="group bg-card rounded-xl border px-5 open:pb-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
            {f.q}
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={20}
              className="text-brand-blue shrink-0 transition-transform group-open:rotate-90"
            />
          </summary>
          <p className="text-muted-foreground">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function InsurersStrip() {
  return (
    <section aria-labelledby="aseguradoras" className="border-y bg-white">
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-10 sm:px-6">
        <h2 id="aseguradoras" className="text-muted-foreground text-center text-sm font-medium">
          Comparo opciones de las principales aseguradoras
        </h2>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-lg font-semibold text-slate-500">
          {insurers.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CtaBand({
  title = "Da hoy el primer paso hacia tus metas",
  text = "Agenda tu cita y empecemos a trabajar en tu plan financiero.",
  message,
}: {
  title?: string;
  text?: string;
  message?: string;
}) {
  return (
    <section className="bg-brand-blue text-white">
      <div className="mx-auto grid max-w-6xl justify-items-start gap-6 px-4 py-16 sm:px-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="grid gap-2">
          <h2 className="text-3xl font-semibold text-balance">{title}</h2>
          <p className="text-white/85">{text}</p>
        </div>
        <a
          href={whatsappUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "inverse", size: "xl" })}
        >
          <HugeiconsIcon icon={Calendar03Icon} />
          Agendar por WhatsApp
        </a>
      </div>
    </section>
  );
}

// Migas de pan visibles + datos estructurados BreadcrumbList para Google.
export function Breadcrumbs({
  items,
  tone = "light",
}: {
  items: { name: string; href: string }[];
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const all = [{ name: "Inicio", href: "/" }, ...items];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${site.url}${item.href === "/" ? "" : item.href}`,
          })),
        }}
      />
      <nav aria-label="Ruta de navegación" className={dark ? "text-sm text-white/70" : "text-muted-foreground text-sm"}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < all.length - 1 ? (
                <Link href={item.href} className={`underline-offset-2 hover:underline ${dark ? "hover:text-white" : "hover:text-foreground"}`}>
                  {item.name}
                </Link>
              ) : (
                <span aria-current="page" className={dark ? "text-white" : "text-foreground"}>
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
