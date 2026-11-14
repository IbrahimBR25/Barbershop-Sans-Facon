"use client";

import { useActionState } from "react";
import { confirmAction, type AdminFormState } from "@/app/actions/admin";
import { ConflictWarning, SlotFields } from "@/components/admin/SlotFields";

export function ConfirmForm({
  id,
  isConfirmed,
  defaults,
}: {
  id: string;
  isConfirmed: boolean;
  defaults: { date: string; time: string; durationMin: number; packId: string; adminNote: string };
}) {
  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(confirmAction, null);
  const errors = state?.errors ?? {};
  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <SlotFields defaults={defaults} errors={errors} />
      <ConflictWarning conflict={state?.conflict} />
      {errors.form && <p className="field-error">{errors.form}</p>}
      <button type="submit" className="btn btn-gold mt-6 w-full sm:w-auto" disabled={pending}>
        {pending
          ? "Enregistrement…"
          : isConfirmed
            ? "Enregistrer les modifications"
            : "Confirmer le rendez-vous"}
      </button>
    </form>
  );
}
