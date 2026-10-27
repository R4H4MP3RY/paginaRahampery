"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      language?: string;
      size?: "normal" | "compact";
      "error-callback"?: (code: string) => boolean;
    },
  ) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Widget anti-spam de Cloudflare. Agrega al formulario el campo
// "cf-turnstile-response" que se verifica en el servidor.
export function Turnstile() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const ref = useRef<HTMLDivElement>(null);
  // onReady también se dispara al volver a montar si el script ya estaba cargado.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded || !siteKey || !ref.current || !window.turnstile) return;
    const id = window.turnstile.render(ref.current, {
      sitekey: siteKey,
      language: "es",
      // El tamaño normal mide 300 px fijos y en celulares ensancha el formulario más allá
      // de la pantalla; si no cabe, se usa el compacto (150 px).
      size: ref.current.clientWidth < 300 ? "compact" : "normal",
      // El propio widget muestra el fallo y permite reintentar; devolver true evita que
      // Cloudflare lance un error sin manejar en la consola.
      "error-callback": () => true,
    });
    // El token es de un solo uso: React reinicia el formulario tras cada envío,
    // así que pedimos un token nuevo en ese momento.
    const form = ref.current.closest("form");
    const onReset = () => window.turnstile?.reset(id);
    form?.addEventListener("reset", onReset);
    return () => {
      form?.removeEventListener("reset", onReset);
      window.turnstile?.remove(id);
    };
  }, [loaded, siteKey]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setLoaded(true)}
      />
      <div ref={ref} />
    </>
  );
}
