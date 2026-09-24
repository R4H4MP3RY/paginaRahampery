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
import { Logo } from "@/components/logo";
import { legalDisclaimer, site, whatsappUrl } from "@/lib/site";

const socials = [
  { href: site.social.instagram, label: "Instagram", icon: InstagramIcon },
  { href: site.social.facebook, label: "Facebook", icon: Facebook01Icon },
  { href: site.social.youtube, label: "YouTube", icon: YoutubeIcon },
  { href: site.social.linkedin, label: "LinkedIn", icon: Linkedin01Icon },
];

const linkCls = "hover:text-rc-primary inline-flex items-center gap-2 transition-colors";

// Pie de rc-brand.css (sección 14).
export function SiteFooter() {
  return (
    <footer className="border-rc-line text-rc-sm text-rc-muted border-t">
      <div className="mx-auto grid max-w-[1160px] gap-10 px-6 py-12 md:grid-cols-[1.2fr_1fr]">
        <div className="grid content-start gap-5">
          <Logo className="h-11 self-start" />
          <p className="max-w-sm">{site.slogan}</p>
          <ul className="flex gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="border-rc-line bg-rc-elevated text-rc-heading hover:bg-rc-info-soft hover:text-rc-primary flex size-11 items-center justify-center rounded-full border transition-colors"
                >
                  <HugeiconsIcon icon={s.icon} size={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid content-start gap-3">
          <p className="text-rc-heading font-semibold">Contacto</p>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={linkCls}>
            <HugeiconsIcon icon={WhatsappIcon} size={18} />
            {site.whatsapp.display}
          </a>
          <a href={`mailto:${site.quoteEmail}`} className={linkCls}>
            <HugeiconsIcon icon={Mail01Icon} size={18} />
            Cotizaciones: {site.quoteEmail}
          </a>
          <a href={`mailto:${site.supportEmail}`} className={linkCls}>
            <HugeiconsIcon icon={Mail01Icon} size={18} />
            Soporte: {site.supportEmail}
          </a>
          <p>
            {site.location.locality}, {site.location.region}. Citas presenciales en la Zona Metropolitana de Guadalajara y
            en línea a todo México.
          </p>
          <p>
            Agente de seguros por cuenta propia · Cédula CNSF {site.cnsf.cedula} (tipo {site.cnsf.tipo}).
          </p>
        </div>
      </div>

      <div className="border-rc-line border-t">
        <div className="text-rc-xs mx-auto grid max-w-[1160px] gap-3 px-6 py-6">
          <p className="max-w-[90ch]">{legalDisclaimer}</p>
          <p>
            © {new Date().getFullYear()} {site.name} ·{" "}
            <Link href="/aviso-de-privacidad" className="hover:text-rc-primary underline underline-offset-2">
              Aviso de privacidad
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
