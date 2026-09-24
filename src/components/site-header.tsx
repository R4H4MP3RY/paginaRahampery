import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Isotipo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { site, whatsappUrl } from "@/lib/site";

const nav = [
  { href: "/servicios/finanzas-personales", label: "Para ti" },
  { href: "/servicios/finanzas-para-empresas", label: "Empresas" },
  { href: "/seguros", label: "Seguros y retiro" },
  { href: "/blog", label: "Blog" },
  { href: "/#sobre-mi", label: "Sobre mí" },
];

// Navegación de rc-brand.css (sección 6): fondo translúcido con desenfoque y enlaces en píldora.
export function SiteHeader() {
  return (
    <header className="border-rc-line sticky top-0 z-40 border-b bg-[color-mix(in_srgb,var(--rc-bg)_88%,transparent)] backdrop-blur-[10px]">
      <div className="mx-auto flex min-h-[76px] max-w-[1160px] items-center justify-between gap-5 px-6 py-2">
        <Link href="/" aria-label={`${site.name}, inicio`} className="shrink-0 rounded-lg">
          {/* Isotipo solo: el nombre ya aparece en el pie y en el contenido (Manual, sección 03). */}
          <Isotipo priority className="h-12" />
        </Link>

        <NavLinks items={nav} className="hidden lg:flex" />

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "accent", size: "sm", className: "hidden sm:inline-flex" })}
          >
            <HugeiconsIcon icon={Calendar03Icon} />
            Agenda tu cita
          </a>
          <MobileMenu items={nav} />
        </div>
      </div>
    </header>
  );
}
