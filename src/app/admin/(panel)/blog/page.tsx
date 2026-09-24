import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";

const dateFmt = new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeZone: "America/Mexico_City" });

type Row = { id: string; title: string; slug: string; status: "borrador" | "publicado"; updated_at: string; published_at: string | null };

export default async function AdminBlogPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, status, updated_at, published_at")
    .order("updated_at", { ascending: false });
  const posts = (data ?? []) as Row[];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <Link href="/admin/blog/nuevo" className={buttonVariants({ size: "xl" })}>
          <HugeiconsIcon icon={Add01Icon} />
          Nuevo artículo
        </Link>
      </div>

      {error && <p className="text-destructive">No se pudieron cargar los artículos.</p>}
      {!error && posts.length === 0 && (
        <p className="text-muted-foreground rounded-xl border bg-rc-elevated p-8 text-center">
          Aún no hay artículos. Crea el primero con el botón “Nuevo artículo”.
        </p>
      )}

      {posts.length > 0 && (
        <ul className="divide-y rounded-xl border bg-rc-elevated">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/blog/${p.id}`} className="hover:bg-muted/60 flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="grid gap-0.5">
                  <span className="font-medium">{p.title}</span>
                  <span className="text-muted-foreground text-sm">
                    /blog/{p.slug} · Editado el {dateFmt.format(new Date(p.updated_at))}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    p.status === "publicado"
                      ? "bg-rc-money-soft text-rc-money"
                      : "bg-rc-energy-soft text-rc-energy-text"
                  }`}
                >
                  {p.status === "publicado" ? "Publicado" : "Borrador"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
