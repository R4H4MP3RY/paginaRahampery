import { z } from "zod";
import { offeredInsurances } from "@/lib/site";

const insuranceSlugs = offeredInsurances.map((i) => i.slug) as [string, ...string[]];

export const sexOptions = [
  { value: "femenino", label: "Femenino" },
  { value: "masculino", label: "Masculino" },
] as const;

// Fecha de hoy en México ("AAAA-MM-DD"): el servidor corre en UTC y cerca de medianoche
// ya sería "mañana", lo que cambiaría la edad el día del cumpleaños.
export function todayInMexico(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City" }).format(now);
}

// Edad cumplida a partir de "AAAA-MM-DD".
export function ageFrom(birthDate: string, today = todayInMexico()) {
  const [by, bm, bd] = birthDate.split("-").map(Number);
  const [ty, tm, td] = today.split("-").map(Number);
  return ty - by - (tm < bm || (tm === bm && td < bd) ? 1 : 0);
}

export const quoteSchema = z.object({
  fullName: z.string().trim().min(2, "Escribe tu nombre completo").max(120),
  email: z.email("Escribe un correo válido").trim().max(254),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{10,20}$/, "Escribe un teléfono válido a 10 dígitos"),
  // Quien solicita la cotización contrata la póliza, así que debe ser mayor de edad.
  birthDate: z.iso
    .date("Escribe tu fecha de nacimiento")
    .refine((v) => ageFrom(v) >= 18, "Debes ser mayor de edad para solicitar una cotización")
    .refine((v) => ageFrom(v) <= 100, "Revisa la fecha de nacimiento"),
  sex: z.enum(["femenino", "masculino"], "Elige una opción"),
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
