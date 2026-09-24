import Image from "next/image";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Link from "next/link";
import {
  ArrowRight01Icon,
  Briefcase01Icon,
  ChartIncreaseIcon,
  CheckmarkCircle02Icon,
  Shield01Icon,
  Target01Icon,
  UserIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { PostCard } from "@/components/post-card";
import { QuoteForm } from "@/components/quote-form";
import { CtaBand, FaqList, InsurersStrip, SectionHeading } from "@/components/sections";
import { servicePages } from "@/content/servicios";
import { getPublishedPosts } from "@/lib/blog";
import { categoryIcons, fallbackInsuranceIcon, insuranceIcons } from "@/lib/insurance-icons";
import { buttonVariants } from "@/components/ui/button";
import {
  insuranceCategories,
  offeredInsurances,
  services,
  site,
  whatsappUrl,
  type InsuranceCategory,
  type Service,
} from "@/lib/site";
import portrait from "../../../public/brand/rahampery-contreras.jpg";

const benefits = [
  {
    icon: Target01Icon,
    title: "Un plan a tu medida",
    text: "Tus metas, sueños y objetivos convertidos en un plan financiero de acuerdo con tus necesidades y posibilidades.",
  },
  {
    icon: ChartIncreaseIcon,
    title: "Tu dinero crece",
    text: "Mejor estructura, más enfoque y un aumento real en tu ahorro y patrimonio, sin dejar de disfrutar tu vida.",
  },
  {
    icon: Shield01Icon,
    title: "Tu familia protegida",
    text: "Cuidamos lo más importante: tú y los tuyos, con la protección adecuada para cada etapa.",
  },
];

const steps = [
  {
    title: "Escríbeme por WhatsApp",
    text: "Cuéntame tu situación y agendamos tu cita presencial en la ZMG o en línea desde cualquier parte de México.",
  },
  {
    title: "Medimos tu salud financiera",
    text: "Revisamos ingresos, gastos, deudas, ahorro y protección para saber exactamente dónde estás parado.",
  },
  {
    title: "Construimos tu plan y te acompaño",
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
    a: "La cotización es gratuita. Si además quieres una consultoría para revisar las pólizas que ya tienes y comparar opciones, tiene un costo de $350 MXN por hora.",
  },
  {
    q: "¿Qué incluye el plan financiero personal?",
    a: "Trabajamos juntos durante 12 meses con sesiones trimestrales para medir tu salud financiera y actualizar tu plan. Cuesta $200 MXN al mes o $2,000 MXN al año.",
  },
  {
    q: "¿Trabajas con empresas?",
    a: "Sí. Acompaño a dueños de MIPyMES a revisar su información financiera, su modelo de negocio y su estructura, con sesiones cuando las necesites y sin plazo mínimo de contratación.",
  },
  {
    q: "¿Me dices en qué invertir?",
    a: "Te enseño cómo funcionan las distintas opciones de inversión para que tomes decisiones informadas. No doy recomendaciones personalizadas de compra o venta de valores. Como agente de seguros sí puedo asesorarte en planes de retiro y ahorro con aseguradoras.",
  },
  {
    q: "¿Emites factura?",
    a: "Sí, facturo las consultorías y los planes financieros. Las pólizas de seguro las factura directamente la aseguradora.",
  },
];

export default async function Home() {
  const latestPosts = await getPublishedPosts(3);
  const personas = services.filter((s) => s.audience === "personas");
  const empresas = services.filter((s) => s.audience === "empresas");
  const categories = (Object.keys(insuranceCategories) as InsuranceCategory[])
    .map((c) => ({ id: c, items: offeredInsurances.filter((i) => i.category === c) }))
    .filter((c) => c.items.length > 0);

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy relative overflow-hidden text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_60%,#5a839566,transparent_60%)]"
        />
        <div className="relative mx-auto grid max-w-6xl items-end gap-8 px-4 pt-14 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:pt-20">
          <div className="grid gap-6 pb-4 md:pb-24">
            <p className="text-brand-orange text-sm font-semibold tracking-wide uppercase">
              Coach financiero · Zapopan y todo México
            </p>
            <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Aprovecha, protege y haz crecer tu dinero{" "}
              <span className="text-brand-orange">para cumplir tus metas</span>
            </h1>
            <p className="max-w-xl text-lg text-pretty text-white/80">
              Soy {site.name}. Te acompaño con educación financiera real y un plan hecho a tu medida, sin dejar de
              disfrutar tu dinero y tu vida.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "whatsapp", size: "xl" })}
              >
                <HugeiconsIcon icon={WhatsappIcon} />
                Agenda tu cita por WhatsApp
              </a>
              <a href="#cotizar" className={buttonVariants({ variant: "outline-inverse", size: "xl" })}>
                Cotiza tu seguro gratis
              </a>
            </div>
            <ul className="grid gap-2 pt-2 text-sm text-white/80 sm:flex sm:flex-wrap sm:gap-x-6">
              {["Desde 2020", `Agente de seguros · Cédula CNSF ${site.cnsf.cedula}`, "Presencial y en línea"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="text-brand-green-light" />
                    {t}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-sm md:max-w-none">
            <Image
              src={portrait}
              alt={`${site.name}, coach financiero`}
              priority
              placeholder="blur"
              sizes="(min-width: 768px) 40vw, 90vw"
              // Difumina los bordes para que la foto se funda con el fondo.
              className="h-auto w-full [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_72%,transparent),linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
            />
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="¿Por qué un coach financiero?"
          title="Nadie nos enseñó a manejar el dinero. Aquí aprendes con acompañamiento real."
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <li key={b.title} className="bg-card grid content-start gap-3 rounded-2xl border p-6">
              <span className="bg-secondary text-brand-blue flex size-12 items-center justify-center rounded-xl">
                <HugeiconsIcon icon={b.icon} size={26} />
              </span>
              <h3 className="text-lg font-semibold">{b.title}</h3>
              <p className="text-muted-foreground">{b.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Servicios */}
      <section id="servicios" className="bg-muted">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6">
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
      </section>

      {/* Cómo funciona */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Cómo trabajamos" title="Tres pasos para tomar el control de tu dinero" />
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="grid content-start gap-3">
              <span className="bg-brand-orange text-brand-navy flex size-11 items-center justify-center rounded-full text-lg font-bold">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Seguros */}
      <section id="seguros" className="bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="grid content-start gap-8">
            <SectionHeading
              eyebrow="Seguros y retiro"
              title="Protege a tu familia y tu patrimonio"
              text="Te ayudo a elegir la protección adecuada y a preparar tu retiro. La cotización es gratuita."
            />
            <div className="grid gap-6 sm:grid-cols-2">
              {categories.map((c) => (
                <div key={c.id} className="grid content-start gap-3">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <HugeiconsIcon icon={categoryIcons[c.id]} size={20} className="text-brand-blue" />
                    {insuranceCategories[c.id]}
                  </h3>
                  <ul className="text-muted-foreground grid gap-1.5">
                    {c.items.map((i) => (
                      <li key={i.slug}>
                        <Link
                          href={`/seguros/${i.slug}`}
                          className="hover:text-brand-blue flex items-center gap-2 underline-offset-2 hover:underline"
                        >
                          <HugeiconsIcon
                            icon={insuranceIcons[i.slug] ?? fallbackInsuranceIcon}
                            size={16}
                            className="text-brand-green shrink-0"
                          />
                          {i.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              ¿Ya tienes seguros y quieres saber si te convienen? Revisamos tus pólizas y buscamos mejores opciones en
              una consultoría de $350 MXN por hora.{" "}
              <Link href="/seguros" className="text-brand-blue font-semibold hover:underline">
                Ver todos los seguros
              </Link>
            </p>
          </div>

          <div id="cotizar" className="bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
            <h3 className="mb-1 text-xl font-semibold">Solicita tu cotización</h3>
            <p className="text-muted-foreground mb-6 text-sm">Te respondo con opciones a tu medida, sin compromiso.</p>
            <QuoteForm />
          </div>
        </div>
      </section>

      <InsurersStrip />

      {/* Sobre mí */}
      <section id="sobre-mi" className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid content-start gap-5">
          <SectionHeading eyebrow="Sobre mí" title={`Hola, soy ${site.name}`} />
          <div className="text-muted-foreground grid gap-4 text-lg">
            <p>
              Desde los 12 años me interesé en las finanzas gracias a mis papás, que me llevaban a revisar sus cuentas de
              banco, me enseñaron a ahorrar y me mostraban sus inversiones.
            </p>
            <p>
              Con el tiempo me di cuenta de que no todos tenían esa cultura. Seguí aprendiendo, hice mis propias
              inversiones y comencé a aconsejar a mi familia. En marzo de 2020 lancé mi marca para promover la educación
              financiera y ayudar a más personas a aprovechar, proteger y hacer crecer su dinero, cuidando siempre lo más
              importante: a ellas mismas.
            </p>
          </div>
        </div>
        <figure className="bg-brand-navy grid content-center gap-4 self-start rounded-2xl p-8 text-white">
          <blockquote className="text-2xl leading-snug font-medium text-balance">
            <span className="text-brand-orange">“</span>
            {site.slogan}
            <span className="text-brand-orange">”</span>
          </blockquote>
          <figcaption className="text-sm text-white/70">— {site.name}</figcaption>
        </figure>
      </section>

      {/* Últimos artículos (solo si hay publicados) */}
      {latestPosts.length > 0 && (
        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Blog" title="Aprende a cuidar tu dinero" />
            <Link href="/blog" className="text-brand-blue inline-flex items-center gap-1 font-semibold hover:underline">
              Ver todos los artículos
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* Preguntas frecuentes */}
      <section id="preguntas" className="bg-muted">
        <div className="mx-auto grid max-w-3xl gap-8 px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas" />
          <FaqList faqs={faqs} />
        </div>
      </section>

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
      <h3 className="flex items-center gap-2 text-xl font-semibold">
        <HugeiconsIcon icon={icon} size={22} className="text-brand-blue" />
        <Link href={href} className="hover:text-brand-blue underline-offset-4 hover:underline">
          {title}
        </Link>
      </h3>
      <ul className="grid gap-4">
        {items.map((s) => (
          <li key={s.slug} className="bg-card grid gap-3 rounded-2xl border p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h4 className="text-lg font-semibold">{s.name}</h4>
              <p className="text-brand-blue font-semibold">{s.price}</p>
            </div>
            <p className="text-muted-foreground">{s.summary}</p>
            <a
              href={whatsappUrl(`Hola, me interesa: ${s.name}. ${site.whatsapp.message}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue inline-flex items-center gap-1 text-sm font-semibold hover:underline"
            >
              Me interesa
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </a>
          </li>
        ))}
      </ul>
      <Link href={href} className="text-brand-blue inline-flex items-center gap-1 font-semibold hover:underline">
        Conoce más
        <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
      </Link>
    </div>
  );
}
