import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Briefcase01Icon,
  Calendar03Icon,
  ChartIncreaseIcon,
  CheckmarkCircle02Icon,
  Shield01Icon,
  Target01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { Isotipo, Logo } from "@/components/logo";
import { PostCard } from "@/components/post-card";
import { QuoteForm } from "@/components/quote-form";
import {
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
import { servicePages } from "@/content/servicios";
import { getPublishedPosts } from "@/lib/blog";
import { categoryIcons, fallbackInsuranceIcon, insuranceIcons } from "@/lib/insurance-icons";
import {
  insuranceCategories,
  offeredInsurances,
  services,
  site,
  whatsappUrl,
  type InsuranceCategory,
  type Service,
} from "@/lib/site";
import { cn } from "@/lib/utils";
import portrait from "../../../public/brand/rahampery-contreras.jpg";

// Los tres colores cuentan la historia de la marca: azul protección, verde dinero, naranja energía.
const benefits = [
  {
    icon: Target01Icon,
    tone: "energy" as const,
    title: "Un plan a tu medida",
    text: "Creamos un plan financiero de acuerdo con tus necesidades y posibilidades para cumplir tus metas, sueños y objetivos.",
  },
  {
    icon: ChartIncreaseIcon,
    tone: "money" as const,
    title: "Tu dinero creciendo",
    text: "Creando una estructura, teniendo nuevos hábitos y para tener un aumento real en tu patrimonio, sin dejar de disfrutar tu vida.",
  },
  {
    icon: Shield01Icon,
    tone: "info" as const,
    title: "Protegiendo lo importante",
    text: "Cuidamos lo más importante: tú y los tuyos, además de de tus bienes y patrimonio con la protección adecuada para ti y tus metas.",
  },
];

const steps = [
  {
    title: "Escríbeme por WhatsApp.",
    text: "Cuéntame más sobre ti y tus finanzas y agendamos tu cita presencial en la ZMG o en línea desde cualquier parte de México.",
  },
  {
    title: "Medimos tu salud financiera.",
    text: "Revisamos ingresos, gastos, deudas, ahorro y protección para saber exactamente dónde estás parado.",
  },
  {
    title: "Construimos tu plan y te acompaño.",
    text: "Definimos acciones concretas y les damos seguimiento para que cumplas tus metas.",
  },
];

const faqs = [
  {
    q: "¿Las citas son presenciales o en línea?",
    a: "Ambas. Atiendo de forma presencial en la Zona Metropolitana de Guadalajara y en línea a cualquier parte de la República Mexicana.",
  },
  {
    q: "¿Cuánto cuesta cotizar un seguro?",
    a: "La cotización es gratuita. Si además quieres una consultoría para revisar tu salud financiera y comparar opciones, tiene un costo de $350 MXN por hora.",
  },
  {
    q: "¿Qué incluye el plan financiero personal?",
    a: "Trabajamos juntos durante 12 meses con sesiones trimestrales para medir tu salud financiera y actualizar tu plan, además de contacto directo para resolver dudas sobre opciones de herramientas financieras nuevas o que ya estes utilizando. Cuesta $200 MXN al mes o $2,000 MXN al año.",
  },
  {
    q: "¿Trabajas con empresas?",
    a: "Sí. Acompaño a dueños de MIPyMES a revisar su información financiera, su modelo de negocio y su estructura, con sesiones cuando las necesiten y sin plazo mínimo de contratación.",
  },
  {
    q: "¿Me dices en qué invertir?",
    a: "Te enseño cómo funcionan las distintas opciones de inversión para que tomes decisiones informadas. Por el momento no puedo dar recomendaciones personalizadas de compra o venta de valores. Como agente de seguros sí puedo asesorarte en planes de retiro y ahorro con aseguradoras.",
  },
  {
    q: "¿Emites factura?",
    a: "Sí, facturo las consultorías y los planes financieros.",
  },
];

const linkArrowCls = "text-rc-primary text-rc-sm inline-flex items-center gap-1 font-semibold hover:underline";

export default async function Home() {
  const latestPosts = await getPublishedPosts(3);
  const personas = services.filter((s) => s.audience === "personas");
  const empresas = services.filter((s) => s.audience === "empresas");
  const categories = (Object.keys(insuranceCategories) as InsuranceCategory[])
    .map((c) => ({ id: c, items: offeredInsurances.filter((i) => i.category === c) }))
    .filter((c) => c.items.length > 0);

  return (
    <>
      {/* Menos espacio arriba que en otras páginas: así el logo, el título y los botones
          caben completos al entrar en pantallas de laptop (probado a 1522×778, Windows al 125 %). */}
      <Hero className="pt-8">
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6">
            {/* Imagotipo horizontal grande: max-w-sm = 384 px, casi el ancho del texto de abajo. */}
            <Logo priority className="mb-2 h-auto w-full max-w-sm" />
            <p className="text-rc-xs text-rc-energy-text font-semibold tracking-[0.16em] uppercase">
              Coach financiero · Zapopan y todo México
            </p>
            <h1>
              Tu dinero protegido y creciendo, de la mano de <span className="text-rc-primary">tu coach financiero</span>
            </h1>
            <p className="text-rc-lg text-rc-muted max-w-[60ch] leading-relaxed">
              Soy {site.name}. Te ayudo a que aprendas como aprovechar, proteger y hacer crecer tu dinero con educación financiera real y
              un plan hecho a tu medida, sin dejar de disfrutar tu vida.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "accent", size: "xl" })}
              >
                <HugeiconsIcon icon={Calendar03Icon} />
                Agenda tu cita
              </a>
              <a href="#cotizar" className={buttonVariants({ variant: "outline", size: "xl" })}>
                Cotiza tu seguro gratis
              </a>
            </div>
            <ul className="text-rc-sm text-rc-muted flex flex-wrap gap-x-6 gap-y-2">
              {["Desde 2020", `Agente de seguros · Cédula CNSF ${site.cnsf.cedula}`, "Presencial y en línea", "Experiencia de más de 15 años"].map(
                (t) => (
                  <li key={t} className="inline-flex items-center gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-rc-money" />
                    {t}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="shadow-rc-2 overflow-hidden rounded-cta">
              <Image
                src={portrait}
                alt={`${site.name}, coach financiero`}
                priority
                placeholder="blur"
                sizes="(min-width: 768px) 28rem, 90vw"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <div className="border-rc-line bg-rc-elevated shadow-rc-2 absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border px-4 py-3 sm:-left-6">
              <Isotipo />
              <div className="grid leading-tight">
                <span className="text-rc-heading text-rc-sm font-semibold">Agente certificado</span>
                <span className="text-rc-muted text-rc-xs">CNSF · Cédula {site.cnsf.cedula}</span>
              </div>
            </div>
          </div>
        </div>
      </Hero>

      <Section>
        <div className={cn(container, "grid gap-10")}>
          <SectionHeading
            eyebrow="¿Por qué un coach financiero?"
            title="Nadie nos enseñó a manejar el dinero. Aquí aprendes con compañía profesional."
          />
          <ul className="grid gap-6 md:grid-cols-3">
            {benefits.map((b) => (
              <li key={b.title} className={cardCls}>
                <IconTile icon={b.icon} tone={b.tone} />
                <h3 className="text-rc-lg">{b.title}</h3>
                <p className="text-rc-muted">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="servicios" tint>
        <div className={cn(container, "grid gap-10")}>
          <SectionHeading
            eyebrow="Servicios"
            title="Consultoría y planes financieros"
            text="Precios claros desde el inicio. Elige cómo quieres empezar."
          />
          <div className="grid gap-10 lg:grid-cols-2">
            <ServiceGroup title="Para ti" icon={UserIcon} items={personas} href={servicePath("personas")} />
            <ServiceGroup
              title="Para tu empresa (MIPyMES)"
              icon={Briefcase01Icon}
              items={empresas}
              href={servicePath("empresas")}
            />
          </div>
        </div>
      </Section>

      <Section>
        <div className={cn(container, "grid gap-10")}>
          <SectionHeading eyebrow="Cómo trabajamos" title="Tres pasos para tomar el control de tu dinero" />
          <ol className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="grid content-start gap-3">
                <span className="bg-rc-accent text-rc-on-accent text-rc-lg flex size-12 items-center justify-center rounded-full font-semibold">
                  {i + 1}
                </span>
                <h3 className="text-rc-lg">{s.title}</h3>
                <p className="text-rc-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section id="seguros" tint>
        <div className={cn(container, "grid gap-12 lg:grid-cols-[1fr_1.05fr]")}>
          <div className="grid content-start gap-8">
            <SectionHeading
              eyebrow="Seguros, ahorros y retiro."
              title="Protege a los que quieres, a ti y tu patrimonio"
              text="Te ayudo a elegir la protección adecuada, empezar a ahorrar y a preparar tu retiro. La cotización es gratuita."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((c) => (
                <div key={c.id} className={cn(cardCls, "gap-4")}>
                  <h3 className="text-rc-md flex items-center gap-2">
                    <HugeiconsIcon icon={categoryIcons[c.id]} size={22} className="text-rc-primary" />
                    {insuranceCategories[c.id]}
                  </h3>
                  <ul className="text-rc-sm grid gap-2">
                    {c.items.map((i) => (
                      <li key={i.slug}>
                        <Link
                          href={`/seguros/${i.slug}`}
                          className="text-rc-text hover:text-rc-primary inline-flex items-center gap-2 underline-offset-3 hover:underline"
                        >
                          <HugeiconsIcon
                            icon={insuranceIcons[i.slug] ?? fallbackInsuranceIcon}
                            size={18}
                            className="text-rc-money shrink-0"
                          />
                          {i.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-rc-sm text-rc-muted">
              ¿Ya tienes seguros y quieres saber si te convienen? Revisamos tus pólizas y buscamos mejores opciones en
              una consultoría de <span className="text-rc-money font-semibold">$350 MXN por hora</span>.{" "}
              <Link href="/seguros" className="text-rc-primary font-semibold hover:underline">
                Ver todos los seguros
              </Link>
            </p>
          </div>

          <div id="cotizar" className={cn(cardCls, "shadow-rc-2 gap-1 self-start p-6 sm:p-8")}>
            <h3 className="text-rc-xl">Solicita tu cotización</h3>
            <p className="text-rc-sm text-rc-muted mb-5">Te respondo con opciones a tu medida, sin compromiso.</p>
            <QuoteForm />
          </div>
        </div>
      </Section>

      <InsurersStrip />

      <Section id="sobre-mi">
        <div className={cn(container, "grid gap-12 lg:grid-cols-[1.2fr_0.8fr]")}>
          <div className="grid content-start gap-5">
            <SectionHeading eyebrow="Sobre mí" title={`Hola, soy ${site.name}`} />
            <div className="text-rc-muted grid max-w-[68ch] gap-4">
              <p>
                Desde los 12 años el dinero, el ahorro y las inversiones han sido parte de mi vida. Mis papás me llevaban a
                ahorrar a mi cuenta de banco y me dejaban escuchar lo que les explicaban de sus inversiones. Ahí empezó
                todo: investigar, invertir, emprender pequeños negocios y con el tiempo, aprender también sobre los riesgos que hay
                en el mundo financiero.
              </p>
              <p>
                A lo largo de los años escuché las preocupaciones de muchas personas: no saber ahorrar, no saber invertir,
                no tener un seguro que las proteja, caer en fraudes. Por eso, en{" "}
                <strong className="text-rc-text">marzo de 2020</strong> nació esta marca: para promover la educación
                financiera y ayudarte a aprovechar, proteger y hacer crecer tu dinero y no tengas que hacerlo solo y más en este mundo
                con tanta información que puede ser confusa o engañosa.
              </p>
            </div>
          </div>
          <figure className="bg-rc-brand-blue grid content-center gap-4 self-start rounded-card p-8 text-white">
            <blockquote className="text-rc-xl leading-snug font-medium text-balance">
              <span className="text-rc-brand-orange">“</span>
              {site.slogan}
              <span className="text-rc-brand-orange">”</span>
            </blockquote>
            <figcaption className="text-rc-sm text-[#e1eef7]">— {site.name}</figcaption>
          </figure>
        </div>
      </Section>

      {latestPosts.length > 0 && (
        <Section tint>
          <div className={cn(container, "grid gap-8")}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Blog" title="Aprende a cuidar tu dinero" />
              <Link href="/blog" className={linkArrowCls}>
                Ver todos los artículos
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section id="preguntas" tint={latestPosts.length === 0}>
        <div className="mx-auto grid w-full max-w-3xl gap-8 px-6">
          <SectionHeading eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas" />
          <FaqList faqs={faqs} />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

function servicePath(audience: Service["audience"]) {
  return `/servicios/${servicePages.find((p) => p.audience === audience)!.slug}`;
}

function ServiceGroup({
  title,
  icon,
  items,
  href,
}: {
  title: string;
  icon: IconSvgElement;
  items: Service[];
  href: string;
}) {
  return (
    <div className="grid content-start gap-4">
      <h3 className="text-rc-xl flex items-center gap-3">
        <IconTile icon={icon} />
        <Link href={href} className="hover:text-rc-primary underline-offset-4 hover:underline">
          {title}
        </Link>
      </h3>
      <ul className="grid gap-4">
        {items.map((s) => (
          <li key={s.slug} className={cn(cardCls, cardHoverCls)}>
            <h4>{s.name}</h4>
            <p className="text-rc-muted">{s.summary}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-rc-money font-semibold tabular-nums">{s.price}</p>
              <a
                href={whatsappUrl(`Hola, me interesa: ${s.name}. ${site.whatsapp.message}`)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Me interesa
                <HugeiconsIcon icon={ArrowRight01Icon} />
              </a>
            </div>
          </li>
        ))}
      </ul>
      <Link href={href} className={linkArrowCls}>
        Conoce más
        <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
      </Link>
    </div>
  );
}
