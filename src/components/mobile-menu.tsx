"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
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
        className="text-rc-heading hover:bg-rc-surface flex size-11 cursor-pointer list-none items-center justify-center rounded-full [&::-webkit-details-marker]:hidden"
      >
        <HugeiconsIcon icon={Menu01Icon} size={24} className="group-open:hidden" />
        <HugeiconsIcon icon={Cancel01Icon} size={24} className="hidden group-open:block" />
      </summary>
      <nav
        aria-label="Menú móvil"
        onClick={closeOnLink}
        className="bg-rc-elevated border-rc-line shadow-rc-2 absolute right-0 mt-3 grid w-64 gap-1 rounded-card border p-3"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-rc-text hover:bg-rc-surface hover:text-rc-primary rounded-full px-4 py-2.5 font-medium"
          >
            {item.label}
          </Link>
        ))}
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "accent", className: "mt-2 sm:hidden" })}
        >
          <HugeiconsIcon icon={Calendar03Icon} />
          Agenda tu cita
        </a>
      </nav>
    </details>
  );
}
