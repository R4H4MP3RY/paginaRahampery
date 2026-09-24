import type { Metadata, Viewport } from "next";
import { Geist_Mono, Jost } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";

// El manual pide Century Gothic (licencia comercial, no disponible para web).
// Jost es la alternativa libre más cercana: geométrica, con "a" de un solo piso.
const jost = Jost({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "coach financiero",
    "coach financiero Zapopan",
    "coach financiero Guadalajara",
    "finanzas personales",
    "salud financiera",
    "cómo salir de deudas",
    "cómo invertir mi dinero",
    "plan personal de retiro",
    "seguros de vida",
    "ahorro para el retiro",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#persona`,
      name: site.name,
      alternateName: site.legalName,
      image: `${site.url}/brand/rahampery-contreras.jpg`,
      jobTitle: "Coach financiero y agente de seguros",
      url: site.url,
      sameAs: Object.values(site.social),
      worksFor: { "@id": `${site.url}/#negocio` },
    },
    {
      "@type": "FinancialService",
      "@id": `${site.url}/#negocio`,
      name: `${site.name} Coach Financiero`,
      slogan: site.slogan,
      logo: `${site.url}/brand/logo.png`,
      image: `${site.url}/brand/rahampery-contreras.jpg`,
      description: site.description,
      url: site.url,
      telephone: `+${site.whatsapp.number}`,
      email: site.quoteEmail,
      contactPoint: [
        { "@type": "ContactPoint", contactType: "sales", email: site.quoteEmail, availableLanguage: "es" },
        { "@type": "ContactPoint", contactType: "customer support", email: site.supportEmail, availableLanguage: "es" },
      ],
      foundingDate: site.foundedAt,
      founder: { "@id": `${site.url}/#persona` },
      address: {
        "@type": "PostalAddress",
        addressLocality: site.location.locality,
        addressRegion: site.location.region,
        addressCountry: site.location.country,
      },
      areaServed: [
        { "@type": "City", name: "Zapopan" },
        { "@type": "City", name: "Guadalajara" },
        { "@type": "Country", name: "México" },
      ],
      priceRange: "$$",
      sameAs: Object.values(site.social),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#sitio`,
      url: site.url,
      name: site.name,
      inLanguage: "es-MX",
      publisher: { "@id": `${site.url}/#negocio` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={cn("h-full", "antialiased", geistMono.variable, "font-sans", jost.variable)}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={organizationJsonLd} />
        {children}
      </body>
    </html>
  );
}
