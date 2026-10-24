"use client";

import "./globals.css";

// Último recurso: se muestra si falla el layout raíz. Reemplaza todo el documento,
// por eso define su propio <html> y <body>.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="es-MX">
      <body className="grid min-h-screen place-items-center p-6 font-sans antialiased">
        <title>Algo salió mal | Rahampery Contreras</title>
        <main className="grid max-w-md justify-items-start gap-4">
          <h1>Algo salió mal</h1>
          <p className="text-rc-muted">No pudimos cargar el sitio. Inténtalo de nuevo en un momento.</p>
          <button type="button" onClick={() => retry()} className="text-rc-primary font-semibold underline">
            Intentar de nuevo
          </button>
        </main>
      </body>
    </html>
  );
}
