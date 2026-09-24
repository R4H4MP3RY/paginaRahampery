"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Turnstile } from "@/components/turnstile";
import { submitQuote } from "@/lib/actions/quote";
import type { QuoteFormState } from "@/lib/quote-schema";
import { offeredInsurances } from "@/lib/site";

const initialState: QuoteFormState = { ok: false };

const fieldCls = "h-11 bg-white px-3 text-base md:text-sm";

export function QuoteForm({ defaultInsurance }: { defaultInsurance?: string }) {
  const [state, formAction, pending] = useActionState(submitQuote, initialState);

  if (state.ok) {
    return (
      <p role="status" className="border-brand-green-light/40 bg-brand-green-light/10 text-brand-green-ink rounded-xl border p-6 text-base font-medium">
        {state.message}
      </p>
    );
  }

  const v = state.values ?? {};
  const err = (field: keyof NonNullable<QuoteFormState["errors"]>) => state.errors?.[field]?.[0];

  return (
    // @container: las columnas dependen del ancho del formulario, no de la pantalla.
    <form action={formAction} className="@container grid gap-4" noValidate>
      <Field id="fullName" label="Nombre completo" error={err("fullName")}>
        <Input className={fieldCls} id="fullName" name="fullName" defaultValue={v.fullName} autoComplete="name" required aria-invalid={!!err("fullName")} />
      </Field>

      <div className="grid gap-4 @md:grid-cols-2">
        <Field id="email" label="Correo" error={err("email")}>
          <Input className={fieldCls} id="email" name="email" type="email" defaultValue={v.email} autoComplete="email" required aria-invalid={!!err("email")} />
        </Field>
        <Field id="phone" label="Teléfono / WhatsApp" error={err("phone")}>
          <Input className={fieldCls} id="phone" name="phone" type="tel" defaultValue={v.phone} autoComplete="tel" required aria-invalid={!!err("phone")} />
        </Field>
      </div>

      <div className="grid gap-4 @md:grid-cols-2">
        <Field id="insuranceType" label="Tipo de seguro" error={err("insuranceType")}>
          <select
            id="insuranceType"
            name="insuranceType"
            defaultValue={v.insuranceType || defaultInsurance || ""}
            required
            aria-invalid={!!err("insuranceType")}
            className="border-input focus-visible:border-ring focus-visible:ring-ring/30 h-11 w-full rounded-md border bg-white px-3 text-base outline-none focus-visible:ring-2 md:text-sm"
          >
            <option value="" disabled>
              Elige una opción
            </option>
            {offeredInsurances.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.name}
              </option>
            ))}
          </select>
        </Field>
        <Field id="city" label="Ciudad (opcional)" error={err("city")}>
          <Input className={fieldCls} id="city" name="city" defaultValue={v.city} autoComplete="address-level2" />
        </Field>
      </div>

      <Field id="message" label="Cuéntame qué necesitas (opcional)" error={err("message")}>
        <Textarea className="min-h-24 bg-white px-3 text-base md:text-sm" id="message" name="message" defaultValue={v.message} maxLength={2000} />
      </Field>

      {/* Honeypot: invisible para personas. */}
      <div aria-hidden="true" className="hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-1">
        <Label className="items-start text-sm leading-snug font-normal">
          <input type="checkbox" name="privacy" defaultChecked={v.privacy === "on"} required className="accent-brand-blue mt-0.5 size-4 shrink-0" />
          <span>
            Acepto el <Link href="/aviso-de-privacidad" className="underline">aviso de privacidad</Link> y
            autorizo el uso de mis datos para recibir mi cotización.
          </span>
        </Label>
        {err("privacy") && <p className="text-destructive text-sm">{err("privacy")}</p>}
      </div>

      <Turnstile />

      {state.message && !state.ok && (
        <p role="alert" className="text-destructive text-sm">
          {state.message}
        </p>
      )}

      <Button type="submit" size="xl" disabled={pending}>
        {pending ? "Enviando…" : "Solicitar cotización"}
      </Button>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
