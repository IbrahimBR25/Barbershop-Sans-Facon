"use client";

import { useActionState } from "react";
import { createManualAction, type AdminFormState } from "@/app/actions/admin";
import { ConflictWarning, SlotFields } from "@/components/admin/SlotFields";

export function ManualForm({ defaultDate }: { defaultDate: string }) {
  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(
    createManualAction,
    null,
  );
  const errors = state?.errors ?? {};
  return (
    <form action={formAction} className="card p-6 sm:p-8">
      <div className="mb-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="mf-name" className="label">
            Nom du client
          </label>
          <input
            id="mf-name"
            name="name"
            type="text"
            className="input"
            maxLength={60}
            required
            autoComplete="off"
            aria-invalid={errors.name ? true : undefined}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="mf-phone" className="label">
            Téléphone
          </label>
          <input
            id="mf-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            className="input"
            maxLength={30}
            required
            autoComplete="off"
            placeholder="22 333 444"
            aria-invalid={errors.phone ? true : undefined}
          />
          {errors.phone && <p className="field-error">{errors.phone}</p>}
        </div>
      </div>
      <SlotFields
        defaults={{ date: defaultDate, time: "10:00", durationMin: 60, packId: "", adminNote: "" }}
        errors={errors}
      />
      <ConflictWarning conflict={state?.conflict} />
      <button type="submit" className="btn btn-gold mt-6 w-full sm:w-auto" disabled={pending}>
        {pending ? "Enregistrement…" : "Ajouter à l'agenda"}
      </button>
    </form>
  );
}
