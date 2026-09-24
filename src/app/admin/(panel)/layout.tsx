import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon, News01Icon, Note01Icon, LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/admin", label: "Cotizaciones", icon: Note01Icon },
  { href: "/admin/blog", label: "Blog", icon: News01Icon },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();

  return (
    <>
      <header className="border-b bg-rc-elevated">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" aria-label="Panel">
              <Logo className="h-9" />
            </Link>
            <nav aria-label="Panel" className="flex gap-1 text-sm font-medium">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="hover:bg-muted flex items-center gap-2 rounded-lg px-3 py-2">
                  <HugeiconsIcon icon={item.icon} size={18} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground hidden md:inline">{email}</span>
            <Link href="/" target="_blank" className="hover:bg-muted flex items-center gap-2 rounded-lg px-3 py-2" aria-label="Ver sitio">
              <HugeiconsIcon icon={LinkSquare02Icon} size={18} />
            </Link>
            <ThemeToggle className="size-9" />
            <form action={logout}>
              <button type="submit" className="hover:bg-muted flex items-center gap-2 rounded-lg px-3 py-2" aria-label="Cerrar sesión">
                <HugeiconsIcon icon={Logout01Icon} size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </>
  );
}
