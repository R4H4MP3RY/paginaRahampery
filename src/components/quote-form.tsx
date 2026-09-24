"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { fieldBase, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Turnstile } from "@/components/turnstile";
import { submitQuote } from "@/lib/actions/quote";
import { sexOptions, type QuoteFormState } from "@/lib/quote-schema";
import { offeredInsurances } from "@/lib/site";
import { cn } from "@/lib/utils";

const initialState: QuoteFormState = { ok: false };
const selectCls = cn(fieldBase, "min-h-[50px] rounded-full px-6");
const defaultHint = "Elige el tipo de seguro y aquí te diré qué información necesito para cotizarte.";

export function QuoteForm({ defaultInsurance }: { defaultInsurance?: string }) {
  const [state, formAction, pending] = useActionState(submitQuote, initialState);
  // Seguro elegido en esta visita; define el texto de ayuda del campo de descripción.
  const [picked, setPicked] = useState<string | null>(null);

  if (state.ok) {
    return (
      <p role="status" className="bg-rc-money-soft text-rc-money rounded-xl p-6 font-medium">
        {state.message}
      </p>
    );
  }

  const v = state.values ?? {};
  const err = (field: keyof NonNullable<QuoteFormState["errors"]>) => state.errors?.[field]?.[0];
  const insurance = picked ?? (v.insuranceType || defaultInsurance || "");
  const hint = offeredInsurances.find((i) => i.slug === insurance)?.quoteHint ?? defaultHint;

  return (
    // @container: las columnas dependen del ancho del formulario, no de la pantalla.
    <form action={formAction} className="@container grid gap-4" noValidate>
      <Field id="fullName" label="Nombre completo" error={err("fullName")}>
        <Input id="fullName" name="fullName" defaultValue={v.fullName} autoComplete="name" required aria-invalid={!!err("fullName")} />
      </Field>

      <div className="grid gap-4 @md:grid-cols-2">
        <Field id="email" label="Correo" error={err("email")}>
          <Input id="email" name="email" type="email" defaultValue={v.email} autoComplete="email" required aria-invalid={!!err("email")} />
        </Field>
        <Field id="phone" label="Teléfono / WhatsApp" error={err("phone")}>
          <Input id="phone" name="phone" type="tel" defaultValue={v.phone} autoComplete="tel" required aria-invalid={!!err("phone")} />
        </Field>
      </div>

      <div className="grid gap-4 @md:grid-cols-2">
        <Field id="birthDate" label="Fecha de nacimiento" error={err("birthDate")}>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            min="1900-01-01"
            defaultValue={v.birthDate}
            autoComplete="bday"
            required
            aria-invalid={!!err("birthDate")}
          />
        </Field>
        <Field id="sex" label="Sexo" error={err("sex")}>
          <select id="sex" name="sex" defaultValue={v.sex || ""} required aria-invalid={!!err("sex")} className={selectCls}>
            <option value="" disabled>
              Elige una opción
            </option>
            {sexOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 @md:grid-cols-2">
        <Field id="insuranceType" label="Tipo de seguro" error={err("insuranceType")}>
          <select
            id="insuranceType"
            name="insuranceType"
            defaultValue={v.insuranceType || defaultInsurance || ""}
            onChange={(e) => setPicked(e.target.value)}
            required
            aria-invalid={!!err("insuranceType")}
            className={selectCls}
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
          <Input id="city" name="city" defaultValue={v.city} autoComplete="address-level2" />
        </Field>
      </div>

      <Field id="message" label="Describe lo que necesitas" error={err("message")}>
        {/* placeholder: texto de ayuda tenue que desaparece al empezar a escribir. */}
        <Textarea id="message" name="message" defaultValue={v.message} placeholder={hint} maxLength={2000} className="field-sizing-content min-h-36" />
      </Field>

      {/* Honeypot: invisible para personas. */}
      <div aria-hidden="true" className="hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-1">
        <Label className="items-start font-normal">
          <input type="checkbox" name="privacy" defaultChecked={v.privacy === "on"} required className="accent-rc-primary mt-1 size-4 shrink-0" />
          <span>
            Acepto el <Link href="/aviso-de-privacidad" className="text-rc-primary underline underline-offset-3">aviso de privacidad</Link> y
            autorizo el uso de mis datos, incluidos los de salud que comparta, para recibir mi cotización.
          </span>
        </Label>
        {err("privacy") && <p className="text-rc-danger text-rc-sm">{err("privacy")}</p>}
      </div>

      <Turnstile />

      {state.message && !state.ok && (
        <p role="alert" className="text-rc-danger text-rc-sm">
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
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-rc-danger text-rc-sm">{error}</p>}
    </div>
  );
}
