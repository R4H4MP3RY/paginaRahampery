"use client";

import { buttonVariants } from "@/components/ui/button";
import { container } from "@/components/sections";
import { whatsappUrl } from "@/lib/site";

// Error inesperado en una página pública. En producción Next no envía el detalle del error
// al navegador; solo el código (digest) para buscarlo en los logs de Vercel.
export default function SitioError({ error, retry }: { error: unknown; retry: () => void }) {
  const digest = error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <section className={`${container} grid justify-items-start gap-6 py-24`}>
      <p className="text-rc-xs text-rc-energy-text font-semibold tracking-[0.16em] uppercase">Algo salió mal</p>
      <h1>No pudimos cargar esta página</h1>
      <p className="text-rc-lg text-rc-muted max-w-[60ch] leading-relaxed">
        Inténtalo de nuevo en un momento. Si el problema continúa, escríbeme por WhatsApp y con gusto te atiendo.
      </p>
      <div className="mt-2 flex flex-wrap gap-3">
        <button type="button" onClick={() => retry()} className={buttonVariants({ variant: "accent", size: "xl" })}>
          Intentar de nuevo
        </button>
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", size: "xl" })}>
          Escribir por WhatsApp
        </a>
      </div>
      {digest && <p className="text-rc-sm text-rc-muted">Código del error: {digest}</p>}
    </section>
  );
}
