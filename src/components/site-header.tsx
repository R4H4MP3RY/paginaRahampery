import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { WhatsappIcon } from "@hugeicons/core-free-icons";
import { MobileMenu } from "@/components/mobile-menu";
import { buttonVariants } from "@/components/ui/button";
import { site, whatsappUrl } from "@/lib/site";
import logo from "../../public/brand/logo.png";

const nav = [
  { href: "/servicios/finanzas-personales", label: "Para ti" },
  { href: "/servicios/finanzas-para-empresas", label: "Empresas" },
  { href: "/seguros", label: "Seguros y retiro" },
  { href: "/blog", label: "Blog" },
  { href: "/#sobre-mi", label: "Sobre mí" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label={`${site.name}, inicio`} className="shrink-0">
          <Image src={logo} alt={`${site.name} Coach Financiero`} priority className="h-14 w-auto sm:h-16" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand-blue transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "whatsapp", size: "xl", className: "hidden h-10 px-4 text-sm sm:inline-flex" })}
          >
            <HugeiconsIcon icon={WhatsappIcon} />
            Agenda tu cita
          </a>

          <MobileMenu items={nav} />
        </div>
      </div>
    </header>
  );
}
