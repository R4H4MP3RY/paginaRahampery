"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { THEME_STORAGE_KEY } from "@/lib/theme";

// Alterna entre modo claro y oscuro. El ícono y el texto se eligen con las clases dark:,
// así el HTML del servidor coincide siempre con el del navegador (sin estado de React).
export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = root.dataset.theme ?? (systemDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";

    // Si la elección coincide con el sistema, se borra la preferencia y el sitio vuelve a seguirlo.
    const followSystem = (next === "dark") === systemDark;
    if (followSystem) delete root.dataset.theme;
    else root.dataset.theme = next;
    try {
      if (followSystem) localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Sin localStorage (modo privado estricto) el cambio dura solo esta visita.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "text-rc-heading hover:bg-rc-surface hover:text-rc-primary flex size-11 items-center justify-center rounded-full transition-colors",
        className,
      )}
    >
      <HugeiconsIcon icon={Moon02Icon} size={22} className="dark:hidden" />
      <HugeiconsIcon icon={Sun03Icon} size={22} className="hidden dark:block" />
      <span className="sr-only dark:hidden">Activar modo oscuro</span>
      <span className="sr-only hidden dark:inline">Activar modo claro</span>
    </button>
  );
}
