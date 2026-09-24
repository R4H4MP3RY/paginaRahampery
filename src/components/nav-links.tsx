"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Enlaces en píldora; el de la página actual queda marcado (aria-current).
export function NavLinks({ items, className }: { items: { href: string; label: string }[]; className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className={cn("items-center gap-1", className)}>
      {items.map((item) => {
        const current = !item.href.includes("#") && (pathname === item.href || pathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className="text-rc-sm text-rc-text hover:bg-rc-surface hover:text-rc-primary aria-[current=page]:bg-rc-surface aria-[current=page]:text-rc-primary inline-flex rounded-full px-3.5 py-2 font-medium transition-colors"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
