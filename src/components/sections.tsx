import Link from "next/link";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { JsonLd } from "@/components/json-ld";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { insurers, site, whatsappUrl } from "@/lib/site";
import type { Faq } from "@/content/seguros";

// Bloques de rc-brand.css convertidos a componentes. Cada comentario indica la sección del CSS.

/** .rc-container */
export const container = "mx-auto w-full max-w-[1160px] px-6";

/** .rc-section y .rc-section--tint */
export function Section({
  tint,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & { tint?: boolean }) {
  return (
    <section className={cn("py-16", tint && "bg-rc-surface", className)} {...props}>
      {children}
    </section>
  );
}

/** .rc-hero: degradado del fondo claro de marca al fondo de la página. */
export function Hero({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("from-rc-surface to-rc-bg bg-linear-to-b pt-16 pb-12", className)}>
      <div className={container}>{children}</div>
    </section>
  );
}

/** .rc-eyebrow + título + .rc-lead */
export function SectionHeading({
  eyebrow,
  title,
  text,
  as: Heading = "h2",
  className,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("grid max-w-[68ch] gap-3", className)}>
      <p className="text-rc-xs text-rc-energy-text font-semibold tracking-[0.16em] uppercase">{eyebrow}</p>
      <Heading>{title}</Heading>
      {text && <p className="text-rc-lg text-rc-muted leading-relaxed text-pretty">{text}</p>}
    </div>
  );
}

/** .rc-card (y a.rc-card:hover cuando es un enlace) */
export const cardCls =
  "border-rc-line bg-rc-elevated shadow-rc-1 flex flex-col gap-3 rounded-card border p-6 transition-[box-shadow,transform,border-color] duration-250 ease-rc";
export const cardHoverCls =
  "hover:shadow-rc-2 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--rc-primary)_35%,var(--rc-line))]";

/** .rc-card__icon con sus variantes --money y --energy */
export function IconTile({ icon, tone = "info" }: { icon: IconSvgElement; tone?: "info" | "money" | "energy" }) {
  const tones = {
    info: "bg-rc-info-soft text-rc-primary",
    money: "bg-rc-money-soft text-rc-money",
    energy: "bg-rc-energy-soft text-rc-energy-text",
  };
  return (
    <span className={cn("grid size-[52px] shrink-0 place-items-center rounded-2xl", tones[tone])}>
      <HugeiconsIcon icon={icon} size={26} />
    </span>
  );
}

/** .rc-chip con sus variantes */
export function Chip({ tone = "seguros", children }: { tone?: "seguros" | "inversion" | "ahorro"; children: React.ReactNode }) {
  const tones = {
    seguros: "bg-rc-info-soft text-rc-primary",
    inversion: "bg-rc-money-soft text-rc-money",
    ahorro: "bg-rc-energy-soft text-rc-energy-text",
  };
  return (
    <span
      className={cn(
        "text-rc-xs inline-flex items-center gap-1.5 rounded-full px-3 py-1 leading-normal font-medium before:size-[7px] before:rounded-full before:bg-current",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** .rc-faq: preguntas con + / – */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="flex flex-col gap-3">
      {faqs.map((f) => (
        <details key={f.q} className="group border-rc-line bg-rc-elevated rounded-xl border px-6 py-4">
          <summary className="text-rc-heading flex cursor-pointer list-none justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
            {f.q}
            <span aria-hidden="true" className="text-rc-primary text-[1.4em] leading-none">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">–</span>
            </span>
          </summary>
          <p className="text-rc-sm text-rc-muted mt-3">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function InsurersStrip() {
  return (
    <section aria-labelledby="aseguradoras" className="border-rc-line border-y">
      <div className={cn(container, "grid gap-5 py-10")}>
        <h2 id="aseguradoras" className="text-rc-xs text-rc-muted text-center font-semibold tracking-[0.16em] uppercase">
          Comparo opciones de las principales aseguradoras
        </h2>
        <ul className="text-rc-lg text-rc-heading/70 flex flex-wrap justify-center gap-x-8 gap-y-3 font-semibold">
          {insurers.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** .rc-cta: bloque azul redondeado dentro del contenedor. */
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
    <Section>
      <div className={container}>
        {/* En celular: un poco menos de relleno y el botón puede partirse en dos líneas,
            para que ni el botón ni el título se salgan del recuadro. */}
        <div className="bg-rc-brand-blue grid grid-cols-[minmax(0,1fr)] items-center gap-6 rounded-cta p-6 text-white sm:p-12 md:grid-cols-[1fr_auto]">
          <div className="grid gap-2">
            <h2 className="text-white">{title}</h2>
            <p className="text-[#e1eef7]">{text}</p>
          </div>
          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: "accent",
              size: "xl",
              className: "text-rc-sm sm:text-rc-md max-w-full justify-self-start px-5 text-center whitespace-normal sm:px-8",
            })}
          >
            <HugeiconsIcon icon={Calendar03Icon} />
            Agendar por WhatsApp
          </a>
        </div>
      </div>
    </Section>
  );
}

// Migas de pan visibles + datos estructurados BreadcrumbList para Google.
export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
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
      <nav aria-label="Ruta de navegación" className="text-rc-sm text-rc-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < all.length - 1 ? (
                <Link href={item.href} className="hover:text-rc-primary underline-offset-2 hover:underline">
                  {item.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-rc-heading font-medium">
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
