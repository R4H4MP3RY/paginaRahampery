import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Facebook01Icon,
  InstagramIcon,
  Linkedin01Icon,
  Mail01Icon,
  WhatsappIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { legalDisclaimer, site, whatsappUrl } from "@/lib/site";
import logo from "../../public/brand/logo.png";

const socials = [
  { href: site.social.instagram, label: "Instagram", icon: InstagramIcon },
  { href: site.social.facebook, label: "Facebook", icon: Facebook01Icon },
  { href: site.social.youtube, label: "YouTube", icon: YoutubeIcon },
  { href: site.social.linkedin, label: "LinkedIn", icon: Linkedin01Icon },
];

export function SiteFooter() {
  return (
    <footer className="bg-muted border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div className="grid content-start gap-5">
          <Image src={logo} alt={`${site.name} Coach Financiero`} className="h-24 w-auto self-start" />
          <p className="text-muted-foreground max-w-sm text-sm">{site.slogan}</p>
          <ul className="flex gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="hover:text-brand-blue flex size-10 items-center justify-center rounded-full border bg-white transition-colors"
                >
                  <HugeiconsIcon icon={s.icon} size={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid content-start gap-3 text-sm">
          <p className="font-semibold">Contacto</p>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue inline-flex items-center gap-2">
            <HugeiconsIcon icon={WhatsappIcon} size={18} />
            {site.whatsapp.display}
          </a>
          <a href={`mailto:${site.quoteEmail}`} className="hover:text-brand-blue inline-flex items-center gap-2">
            <HugeiconsIcon icon={Mail01Icon} size={18} />
            Cotizaciones: {site.quoteEmail}
          </a>
          <a href={`mailto:${site.supportEmail}`} className="hover:text-brand-blue inline-flex items-center gap-2">
            <HugeiconsIcon icon={Mail01Icon} size={18} />
            Soporte: {site.supportEmail}
          </a>
          <p className="text-muted-foreground">
            {site.location.locality}, {site.location.region}. Citas presenciales en la Zona Metropolitana de Guadalajara y
            en línea a todo México.
          </p>
          <p className="text-muted-foreground">
            Agente de seguros por cuenta propia · Cédula CNSF {site.cnsf.cedula} (tipo {site.cnsf.tipo}).
          </p>
        </div>
      </div>

      <div className="border-t">
        <div className="text-muted-foreground mx-auto grid max-w-6xl gap-3 px-4 py-6 text-xs sm:px-6">
          <p>{legalDisclaimer}</p>
          <p>
            © {new Date().getFullYear()} {site.name} ·{" "}
            <Link href="/aviso-de-privacidad" className="underline underline-offset-2">
              Aviso de privacidad
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
