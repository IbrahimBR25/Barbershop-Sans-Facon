import { z } from "zod";
import { getPack, site } from "@/config/site";
import {
  addDays,
  bookingSlots,
  isClosedDay,
  isDateStr,
  isTimeStr,
  todayInTz,
} from "@/lib/dates";
import { normalizePhone } from "@/lib/phone";

/** Retire les caractères de contrôle et normalise les espaces. */
function clean(value: string): string {
  return value
    .normalize("NFC")
    .replace(/[\u0000-\u001f\u007f​-‏‪-‮⁦-⁩]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const name = z
  .string()
  .transform(clean)
  .pipe(
    z
      .string()
      .min(2, "Indiquez votre nom.")
      .max(60, "Nom trop long.")
      .regex(/^[\p{L}\p{M}][\p{L}\p{M}\s'’.-]*$/u, "Le nom ne doit contenir que des lettres."),
  );

const phone = z
  .string()
  .max(30, "Numéro invalide.")
  .transform((value, ctx) => {
    const normalized = normalizePhone(value);
    if (!normalized) {
      ctx.addIssue({
        code: "custom",
        message: "Numéro invalide. Exemple : 22 333 444",
      });
      return z.NEVER;
    }
    return normalized;
  });

const packId = z
  .string()
  .max(40)
  .transform((value) => (value && getPack(value) ? value : null));

const optionalText = (max: number) =>
  z
    .string()
    .max(max * 2)
    .transform(clean)
    .pipe(z.string().max(max, `${max} caractères maximum.`))
    .transform((value) => (value === "" ? null : value));

const dateStr = z.string().refine(isDateStr, "Choisissez un jour.");
const timeStr = z.string().refine(isTimeStr, "Heure invalide.");

/** Formulaire public de demande de rendez-vous. */
export const requestSchema = z.object({
  name,
  phone,
  packId,
  date: dateStr.superRefine((value, ctx) => {
    if (!isDateStr(value)) return;
    const today = todayInTz();
    if (value < today) {
      ctx.addIssue({ code: "custom", message: "Cette date est déjà passée." });
    } else if (value > addDays(today, site.booking.maxDaysAhead)) {
      ctx.addIssue({ code: "custom", message: "Cette date est trop lointaine. Appelez-nous." });
    } else if (isClosedDay(value)) {
      ctx.addIssue({ code: "custom", message: "Le salon est fermé ce jour-là." });
    }
  }),
  /** Chaîne vide = « flexible ». */
  time: z
    .string()
    .max(5)
    .refine((value) => value === "" || bookingSlots().includes(value), "Choisissez une heure.")
    .transform((value) => (value === "" ? null : value)),
  message: optionalText(300),
});

export type RequestInput = z.infer<typeof requestSchema>;

const duration = z.coerce
  .number()
  .int()
  .min(15, "Durée minimale : 15 min.")
  .max(600, "Durée maximale : 10 h.");

/** Confirmation / modification d'un rendez-vous par le gérant. */
export const confirmSchema = z.object({
  id: z.uuid(),
  date: dateStr,
  time: timeStr,
  durationMin: duration,
  packId,
  adminNote: optionalText(1000),
  force: z.string().optional().transform((value) => value === "on"),
});

/** Rendez-vous créé directement par le gérant. */
export const manualSchema = z.object({
  name,
  phone,
  packId,
  date: dateStr,
  time: timeStr,
  durationMin: duration,
  adminNote: optionalText(1000),
  force: z.string().optional().transform((value) => value === "on"),
});

export const idSchema = z.object({ id: z.uuid() });

export type FieldErrors = Record<string, string>;

/** Premier message d'erreur par champ. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Lit un champ texte d'un FormData (jamais un fichier). */
export function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
