import { z } from "zod";
import { offeredInsurances } from "@/lib/site";

const insuranceSlugs = offeredInsurances.map((i) => i.slug) as [string, ...string[]];

export const quoteSchema = z.object({
  fullName: z.string().trim().min(2, "Escribe tu nombre completo").max(120),
  email: z.email("Escribe un correo válido").trim().max(254),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{10,20}$/, "Escribe un teléfono válido a 10 dígitos"),
  city: z.string().trim().max(120).optional(),
  insuranceType: z.enum(insuranceSlugs, "Elige el tipo de seguro"),
  message: z.string().trim().max(2000, "Máximo 2000 caracteres").optional(),
  privacy: z.literal("on", "Debes aceptar el aviso de privacidad"),
});

export type QuoteFormState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof quoteSchema>, string[]>>;
  // Lo que escribió el usuario, para no perderlo cuando hay errores.
  values?: Record<string, string>;
};
