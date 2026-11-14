"use client";

import { site } from "@/config/site";
import type { FieldErrors } from "@/lib/validation";

const durations = [30, 45, 60, 90, 120, 150, 180, 240];

function label(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m}`;
}

/** Champs communs : date, heure, durée, formule, note interne. */
export function SlotFields({
  defaults,
  errors,
}: {
  defaults: { date: string; time: string; durationMin: number; packId: string; adminNote: string };
  errors: FieldErrors;
}) {
  const durationOptions = durations.includes(defaults.durationMin)
    ? durations
    : [...durations, defaults.durationMin].sort((a, b) => a - b);
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="sf-date" className="label">
            Date
          </label>
          <input
            id="sf-date"
            name="date"
            type="date"
            className="input"
            required
            defaultValue={defaults.date}
            aria-invalid={errors.date ? true : undefined}
          />
          {errors.date && <p className="field-error">{errors.date}</p>}
        </div>
        <div>
          <label htmlFor="sf-time" className="label">
            Heure
          </label>
          <input
            id="sf-time"
            name="time"
            type="time"
            className="input"
            step={300}
            required
            defaultValue={defaults.time}
            aria-invalid={errors.time ? true : undefined}
          />
          {errors.time && <p className="field-error">{errors.time}</p>}
        </div>
        <div>
          <label htmlFor="sf-duration" className="label">
            Durée
          </label>
          <select
            id="sf-duration"
            name="durationMin"
            className="input"
            defaultValue={String(defaults.durationMin)}
          >
            {durationOptions.map((d) => (
              <option key={d} value={d}>
                {label(d)}
              </option>
            ))}
          </select>
          {errors.durationMin && <p className="field-error">{errors.durationMin}</p>}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="sf-pack" className="label">
          Formule
        </label>
        <select id="sf-pack" name="packId" className="input" defaultValue={defaults.packId}>
          <option value="">À définir</option>
          {site.packs.map((pack) => (
            <option key={pack.id} value={pack.id}>
              {pack.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="sf-note" className="label">
          Note interne <span className="normal-case tracking-normal text-stone">(jamais visible du client)</span>
        </label>
        <textarea
          id="sf-note"
          name="adminNote"
          className="input min-h-[5rem] resize-y"
          rows={2}
          maxLength={1000}
          defaultValue={defaults.adminNote}
        />
        {errors.adminNote && <p className="field-error">{errors.adminNote}</p>}
      </div>
    </>
  );
}

export function ConflictWarning({ conflict }: { conflict?: string }) {
  if (!conflict) return null;
  return (
    <div className="mt-5 border border-danger/60 bg-danger/10 p-4 text-[0.9375rem]" role="alert">
      <p className="text-danger">Ce créneau chevauche un autre rendez-vous : {conflict}.</p>
      <label className="mt-3 flex cursor-pointer items-center gap-3 text-ivory">
        <input type="checkbox" name="force" className="h-5 w-5 accent-[var(--color-gold)]" />
        Enregistrer quand même
      </label>
    </div>
  );
}
