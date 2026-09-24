"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Menu01Icon, WhatsappIcon } from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/site";

// <details> funciona aun sin JavaScript; con JavaScript se cierra al elegir un enlace,
// al tocar fuera del menú o con Escape (el encabezado persiste entre páginas).
export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = () => {
      if (ref.current) ref.current.open = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current?.open) {
        close();
        ref.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const closeOnLink = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a") && ref.current) ref.current.open = false;
  };

  return (
    <details ref={ref} className="group relative lg:hidden">
      <summary
        aria-label="Menú"
        className="hover:bg-muted flex size-10 cursor-pointer list-none items-center justify-center rounded-lg [&::-webkit-details-marker]:hidden"
      >
        <HugeiconsIcon icon={Menu01Icon} size={24} className="group-open:hidden" />
        <HugeiconsIcon icon={Cancel01Icon} size={24} className="hidden group-open:block" />
      </summary>
      <nav
        aria-label="Menú móvil"
        onClick={closeOnLink}
        className="bg-background absolute right-0 mt-2 grid w-60 gap-1 rounded-xl border p-2 text-base shadow-lg"
      >
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="hover:bg-muted rounded-lg px-3 py-2.5">
            {item.label}
          </Link>
        ))}
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "whatsapp", size: "xl", className: "mt-1 sm:hidden" })}
        >
          <HugeiconsIcon icon={WhatsappIcon} />
          Agenda tu cita
        </a>
      </nav>
    </details>
  );
}
