import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, WhatsappIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { updateQuote } from "@/lib/actions/quotes";
import { quoteStatuses, statusLabels, type QuoteStatus } from "@/lib/quote-status";
import { insurances } from "@/lib/site";

const statusStyles: Record<QuoteStatus, string> = {
  nueva: "bg-brand-orange/15 text-brand-orange-ink",
  en_proceso: "bg-brand-blue/10 text-brand-blue",
  cotizada: "bg-brand-blue-light/20 text-brand-blue",
  cerrada: "bg-brand-green-light/15 text-brand-green-ink",
  descartada: "bg-muted text-muted-foreground",
};

type Quote = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  city: string | null;
  insurance_type: string;
  message: string | null;
  status: QuoteStatus;
  admin_notes: string | null;
};

const dateFmt = new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Mexico_City" });

export default async function QuotesPage({ searchParams }: PageProps<"/admin">) {
  const { supabase } = await requireAdmin();
  const { estado } = await searchParams;
  const filter = quoteStatuses.find((s) => s === estado);

  let query = supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(200);
  if (filter) query = query.eq("status", filter);
  const { data, error } = await query;
  const quotes = (data ?? []) as Quote[];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold">Solicitudes de cotización</h1>
        <nav aria-label="Filtrar por estado" className="flex flex-wrap gap-1 text-sm">
          <FilterLink href="/admin" active={!filter} label="Todas" />
          {quoteStatuses.map((s) => (
            <FilterLink key={s} href={`/admin?estado=${s}`} active={filter === s} label={statusLabels[s]} />
          ))}
        </nav>
      </div>

      {error && <p className="text-destructive">No se pudieron cargar las solicitudes.</p>}
      {!error && quotes.length === 0 && (
        <p className="text-muted-foreground rounded-xl border bg-white p-8 text-center">No hay solicitudes todavía.</p>
      )}

      <ul className="grid gap-4">
        {quotes.map((q) => {
          const insurance = insurances.find((i) => i.slug === q.insurance_type)?.name ?? q.insurance_type;
          const phoneDigits = q.phone.replace(/\D/g, "");
          const wa = `https://wa.me/${phoneDigits.length === 10 ? `52${phoneDigits}` : phoneDigits}`;
          return (
            <li key={q.id} className="grid gap-4 rounded-xl border bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-1">
                  <p className="font-semibold">{q.full_name}</p>
                  <p className="text-muted-foreground text-sm">
                    {insurance} · {q.city || "Sin ciudad"} · {dateFmt.format(new Date(q.created_at))}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[q.status]}`}>
                  {statusLabels[q.status]}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <a href={`mailto:${q.email}`} className="text-brand-blue inline-flex items-center gap-1.5 hover:underline">
                  <HugeiconsIcon icon={Mail01Icon} size={16} />
                  {q.email}
                </a>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-green-ink inline-flex items-center gap-1.5 hover:underline"
                >
                  <HugeiconsIcon icon={WhatsappIcon} size={16} />
                  {q.phone}
                </a>
              </div>

              {q.message && <p className="bg-muted rounded-lg p-3 text-sm whitespace-pre-line">{q.message}</p>}

              <form action={updateQuote} className="grid gap-3 border-t pt-4 sm:grid-cols-[12rem_1fr_auto] sm:items-start">
                <input type="hidden" name="id" value={q.id} />
                <label className="grid gap-1 text-xs font-medium">
                  Estado
                  <select
                    name="status"
                    defaultValue={q.status}
                    className="border-input h-9 rounded-md border bg-white px-2 text-sm"
                  >
                    {quoteStatuses.map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-medium">
                  Notas internas
                  <textarea
                    name="adminNotes"
                    defaultValue={q.admin_notes ?? ""}
                    rows={1}
                    maxLength={4000}
                    className="border-input field-sizing-content min-h-9 rounded-md border bg-white px-2 py-1.5 text-sm"
                  />
                </label>
                <Button type="submit" size="lg" className="sm:mt-5">
                  Guardar
                </Button>
              </form>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full border px-3 py-1.5 ${active ? "bg-brand-blue border-brand-blue text-white" : "bg-white hover:bg-white/60"}`}
    >
      {label}
    </Link>
  );
}
