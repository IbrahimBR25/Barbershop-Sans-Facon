"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession, requireAdmin, verifyPassword } from "@/lib/auth";
import {
  confirmBooking,
  createConfirmed,
  deleteCancelled,
  findConflicts,
  setStatus,
  type Booking,
} from "@/lib/bookings";
import { isRateLimited } from "@/lib/ratelimit";
import { clientIpHash } from "@/lib/request";
import {
  confirmSchema,
  field,
  fieldErrors,
  idSchema,
  manualSchema,
  type FieldErrors,
} from "@/lib/validation";

/** Vide le cache de navigation de l'espace gérant (compteur, listes, agenda). */
function refreshAdmin(): void {
  revalidatePath("/admin", "layout");
}

export type LoginState = { error: string } | null;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = field(formData, "password");

  let ok = false;
  try {
    // 8 essais par quart d'heure et par visiteur.
    if (await isRateLimited(`login:${await clientIpHash()}`, 900, 8)) {
      return { error: "Trop de tentatives. Réessayez dans un quart d'heure." };
    }
    ok = password.length > 0 && password.length <= 200 && (await verifyPassword(password));
  } catch (error) {
    console.error("[admin] connexion impossible :", (error as Error).message);
    return { error: "Connexion impossible pour le moment." };
  }
  if (!ok) return { error: "Mot de passe incorrect." };

  await createSession();
  refreshAdmin();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  refreshAdmin();
  redirect("/admin/connexion");
}

export type AdminFormState = {
  errors: FieldErrors;
  /** Rendez-vous déjà confirmés qui chevauchent le créneau choisi. */
  conflict?: string;
} | null;

function describeConflicts(conflicts: Booking[]): string {
  return conflicts.map((b) => `${b.name} à ${b.confirmedTime}`).join(", ");
}

/** Confirme (ou modifie) un rendez-vous après l'appel au client. */
export async function confirmAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = confirmSchema.safeParse({
    id: field(formData, "id"),
    date: field(formData, "date"),
    time: field(formData, "time"),
    durationMin: field(formData, "durationMin"),
    packId: field(formData, "packId"),
    adminNote: field(formData, "adminNote"),
    force: field(formData, "force") || undefined,
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const input = parsed.data;

  if (!input.force) {
    const conflicts = await findConflicts(input.date, input.time, input.durationMin, input.id);
    if (conflicts.length > 0) return { errors: {}, conflict: describeConflicts(conflicts) };
  }

  const updated = await confirmBooking(input.id, {
    date: input.date,
    time: input.time,
    durationMin: input.durationMin,
    packId: input.packId,
    adminNote: input.adminNote,
  });
  if (!updated) return { errors: { form: "Rendez-vous introuvable." } };

  refreshAdmin();
  redirect(`/admin/rdv/${input.id}?fait=confirme`);
}

/** Crée directement un rendez-vous confirmé (client au téléphone ou sur place). */
export async function createManualAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = manualSchema.safeParse({
    name: field(formData, "name"),
    phone: field(formData, "phone"),
    packId: field(formData, "packId"),
    date: field(formData, "date"),
    time: field(formData, "time"),
    durationMin: field(formData, "durationMin"),
    adminNote: field(formData, "adminNote"),
    force: field(formData, "force") || undefined,
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const input = parsed.data;

  if (!input.force) {
    const conflicts = await findConflicts(input.date, input.time, input.durationMin, null);
    if (conflicts.length > 0) return { errors: {}, conflict: describeConflicts(conflicts) };
  }

  const booking = await createConfirmed({
    name: input.name,
    phone: input.phone,
    packId: input.packId,
    date: input.date,
    time: input.time,
    durationMin: input.durationMin,
    adminNote: input.adminNote,
  });
  refreshAdmin();
  redirect(`/admin/rdv/${booking.id}?fait=cree`);
}

export async function cancelAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = idSchema.safeParse({ id: field(formData, "id") });
  if (!parsed.success) redirect("/admin");
  await setStatus(parsed.data.id, "cancelled");
  refreshAdmin();
  redirect(`/admin/rdv/${parsed.data.id}?fait=annule`);
}

export async function reopenAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = idSchema.safeParse({ id: field(formData, "id") });
  if (!parsed.success) redirect("/admin");
  await setStatus(parsed.data.id, "pending");
  refreshAdmin();
  redirect(`/admin/rdv/${parsed.data.id}?fait=attente`);
}

/** Efface définitivement une demande annulée (droit à l'effacement). */
export async function deleteAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = idSchema.safeParse({ id: field(formData, "id") });
  if (!parsed.success) redirect("/admin");
  const deleted = await deleteCancelled(parsed.data.id);
  refreshAdmin();
  redirect(deleted ? "/admin/historique?fait=supprime" : `/admin/rdv/${parsed.data.id}`);
}
