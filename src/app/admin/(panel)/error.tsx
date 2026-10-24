"use client";

import { Button } from "@/components/ui/button";

// Error inesperado dentro del panel. El código (digest) sirve para encontrar el detalle
// en los logs de Vercel.
export default function PanelError({ error, retry }: { error: unknown; retry: () => void }) {
  const digest = error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <div className="grid justify-items-start gap-4">
      <h1 className="text-2xl font-semibold">Algo salió mal</h1>
      <p className="text-muted-foreground">No se pudo completar la operación. Inténtalo de nuevo.</p>
      {digest && <p className="text-muted-foreground text-sm">Código del error: {digest}</p>}
      <Button onClick={() => retry()}>Intentar de nuevo</Button>
    </div>
  );
}
