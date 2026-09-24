import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: `Aviso de privacidad integral de ${site.name}, coach financiero y agente de seguros.`,
  alternates: { canonical: "/aviso-de-privacidad" },
};

// BORRADOR: revisar con un abogado antes de publicar.
// Actualizar el domicilio en site.ts cuando haya oficina.
export default function AvisoDePrivacidad() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
      <article className="grid gap-6 text-sm leading-relaxed [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5">
        <h1 className="text-3xl font-semibold">Aviso de privacidad integral</h1>

        <section className="grid gap-2">
          <h2>Responsable</h2>
          <p>
            {site.legalName} (“{site.name}”), con domicilio en {site.privacyAddress}, es responsable del tratamiento de tus datos personales conforme a la Ley
            Federal de Protección de Datos Personales en Posesión de los Particulares.
          </p>
        </section>

        <section className="grid gap-2">
          <h2>Datos que recabamos</h2>
          <ul>
            <li>Identificación y contacto: nombre, correo electrónico, teléfono y ciudad.</li>
            <li>Información que decidas compartir en tu mensaje sobre el seguro o servicio que te interesa.</li>
          </ul>
          <p>
            Para cotizar algunos seguros (por ejemplo, gastos médicos o vida) podríamos necesitar datos de salud, que la
            ley considera <strong>datos sensibles</strong>. Solo los solicitaremos cuando sean necesarios y con tu
            consentimiento expreso.
          </p>
        </section>

        <section className="grid gap-2">
          <h2>Finalidades</h2>
          <p>Finalidades necesarias:</p>
          <ul>
            <li>Contactarte y enviarte la cotización o información que solicitaste.</li>
            <li>Prestarte los servicios de consultoría y planeación financiera que contrates.</li>
            <li>Gestionar ante las aseguradoras la cotización y, en su caso, la contratación de pólizas.</li>
          </ul>
          <p>Finalidades adicionales (puedes negarte sin que afecte el servicio):</p>
          <ul>
            <li>Enviarte contenido educativo y promociones.</li>
          </ul>
        </section>

        <section className="grid gap-2">
          <h2>Transferencias</h2>
          <p>
            Tus datos podrán compartirse con las aseguradoras necesarias para cotizar o emitir tu póliza. No vendemos ni
            compartimos tus datos con terceros para fines distintos a los descritos.
          </p>
        </section>

        <section className="grid gap-2">
          <h2>Derechos ARCO y revocación del consentimiento</h2>
          <p>
            Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos, así como revocar tu
            consentimiento, enviando una solicitud a{" "}
            <a href={`mailto:${site.legalEmail}`} className="underline">
              {site.legalEmail}
            </a>{" "}
            con tu nombre, el derecho que deseas ejercer y una copia de tu identificación. Responderemos en los plazos
            que marca la ley.
          </p>
        </section>

        <section className="grid gap-2">
          <h2>Cookies y tecnologías similares</h2>
          <p>
            Este sitio usa únicamente las cookies necesarias para su funcionamiento y para protegerlo contra spam
            (Cloudflare Turnstile).
          </p>
          <p>
            Para conocer cómo se usa el sitio y mejorar su rendimiento utilizamos Vercel Web Analytics y Speed Insights,
            que obtienen estadísticas agregadas y anónimas (páginas visitadas, país, tipo de dispositivo y velocidad de
            carga) sin usar cookies ni identificarte personalmente.
          </p>
        </section>

        <section className="grid gap-2">
          <h2>Cambios al aviso</h2>
          <p>Cualquier cambio a este aviso se publicará en esta página. Última actualización: septiembre de 2026.</p>
        </section>
      </article>
  </div>
);
}
