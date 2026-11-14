"use client";

import { useActionState, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { submitRequest, type RequestState } from "@/app/actions/booking";
import { site } from "@/config/site";
import {
  addDays,
  bookingSlots,
  formatDateLong,
  formatDayNumber,
  formatMonth,
  formatWeekday,
  isClosedDay,
  nowTimeInTz,
  todayInTz,
} from "@/lib/dates";

const noopSubscribe = () => () => {};

/** Date du jour côté navigateur uniquement (la page elle-même est statique). */
function useToday(): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => todayInTz(),
    () => null,
  );
}

function ErrorText({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className="field-error" role="alert">
      {text}
    </p>
  );
}

export function BookingForm() {
  const [state, formAction, pending] = useActionState<RequestState, FormData>(submitRequest, null);
  const today = useToday();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [packId, setPackId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [otherDate, setOtherDate] = useState(false);

  // Présélection depuis les boutons « Choisir cette formule ».
  useEffect(() => {
    const onPack = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (site.packs.some((p) => p.id === id)) setPackId(id);
    };
    window.addEventListener("sf:pack", onPack);
    return () => window.removeEventListener("sf:pack", onPack);
  }, []);

  const quickDays = useMemo(() => {
    if (!today) return [];
    const out: string[] = [];
    const todayOver = nowTimeInTz() >= site.booking.lastSlot;
    for (let i = todayOver ? 1 : 0; out.length < site.booking.quickDays && i < 60; i++) {
      const d = addDays(today, i);
      if (!isClosedDay(d)) out.push(d);
    }
    return out;
  }, [today]);

  const slots = useMemo(() => {
    const all = bookingSlots();
    if (today && date === today) {
      const now = nowTimeInTz();
      return all.filter((slot) => slot > now);
    }
    return all;
  }, [date, today]);

  const errors = state?.errors ?? {};
  const maxDate = today ? addDays(today, site.booking.maxDaysAhead) : undefined;

  function dayLabel(d: string): string {
    if (d === today) return "Auj.";
    if (today && d === addDays(today, 1)) return "Demain";
    return formatWeekday(d, "short").replace(".", "");
  }

  return (
    <form action={formAction} className="card min-w-0 p-6 sm:p-10" noValidate>
      {/* Champ piège anti-robots : ne pas remplir. */}
      <div className="sr-only-field" aria-hidden>
        <label>
          Site web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="time" value={time} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="bf-name" className="label">
            Votre nom
          </label>
          <input
            id="bf-name"
            name="name"
            type="text"
            className="input"
            autoComplete="name"
            maxLength={60}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "bf-name-err" : undefined}
          />
          <ErrorText id="bf-name-err" text={errors.name} />
        </div>

        <div>
          <label htmlFor="bf-phone" className="label">
            Téléphone
          </label>
          <input
            id="bf-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            className="input"
            autoComplete="tel"
            placeholder="22 333 444"
            maxLength={30}
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "bf-phone-err" : "bf-phone-hint"}
          />
          {errors.phone ? (
            <ErrorText id="bf-phone-err" text={errors.phone} />
          ) : (
            <p id="bf-phone-hint" className="mt-2 text-[0.8125rem] text-stone">
              C&apos;est sur ce numéro que nous vous appelons.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="bf-pack" className="label">
          Formule
        </label>
        <select
          id="bf-pack"
          name="packId"
          className="input"
          value={packId}
          onChange={(e) => setPackId(e.target.value)}
        >
          <option value="">Je ne sais pas encore</option>
          {site.packs.map((pack) => (
            <option key={pack.id} value={pack.id}>
              {pack.name} — {pack.tagline}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="mt-8 min-w-0" aria-describedby={errors.date ? "bf-date-err" : undefined}>
        <legend className="label">Jour souhaité</legend>
        <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {quickDays.length === 0
            ? Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="chip min-w-[4.4rem] opacity-30" aria-hidden>
                  &nbsp;
                </span>
              ))
            : quickDays.map((d) => (
                <button
                  key={d}
                  type="button"
                  className="chip min-w-[4.4rem]"
                  aria-pressed={!otherDate && date === d}
                  aria-label={formatDateLong(d)}
                  onClick={() => {
                    setOtherDate(false);
                    setDate(d);
                  }}
                >
                  <span className="text-[0.6875rem] uppercase tracking-[0.14em]">{dayLabel(d)}</span>
                  <span className="font-display text-lg leading-none">
                    {formatDayNumber(d)} {formatMonth(d, "short")}
                  </span>
                </button>
              ))}
          <button
            type="button"
            className="chip"
            aria-pressed={otherDate}
            onClick={() => {
              setOtherDate(true);
              if (quickDays.includes(date)) setDate("");
            }}
          >
            Autre date
          </button>
        </div>
        {otherDate && (
          <div className="mt-3 max-w-xs">
            <label htmlFor="bf-other-date" className="sr-only">
              Choisir une autre date
            </label>
            <input
              id="bf-other-date"
              type="date"
              className="input"
              min={today ?? undefined}
              max={maxDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        )}
        <ErrorText id="bf-date-err" text={errors.date} />
      </fieldset>

      <fieldset className="mt-7 min-w-0" aria-describedby={errors.time ? "bf-time-err" : undefined}>
        <legend className="label">Heure souhaitée</legend>
        <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
          <button
            type="button"
            className="chip col-span-4 sm:col-span-1"
            aria-pressed={time === ""}
            onClick={() => setTime("")}
          >
            Flexible
          </button>
          {slots.map((slot) => (
            <button
              key={slot}
              type="button"
              className="chip tabular-nums"
              aria-pressed={time === slot}
              onClick={() => setTime(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
        <ErrorText id="bf-time-err" text={errors.time} />
      </fieldset>

      <div className="mt-7">
        <label htmlFor="bf-message" className="label">
          Une précision ? <span className="normal-case tracking-normal text-stone">(facultatif)</span>
        </label>
        <textarea
          id="bf-message"
          name="message"
          className="input min-h-[5.5rem] resize-y"
          rows={2}
          maxLength={300}
          placeholder="Ex. : mariage le 28 novembre"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={errors.message ? true : undefined}
        />
        <ErrorText id="bf-message-err" text={errors.message} />
      </div>

      <p className="mt-8 flex gap-3 border border-line bg-ink/60 px-4 py-3.5 text-[0.9375rem] text-ivory">
        <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
        <span>
          Ce créneau est un <strong className="font-medium text-gold-soft">souhait</strong>. Il
          n&apos;est confirmé qu&apos;après notre appel.
        </span>
      </p>

      {state?.message && (
        <p className="field-error mt-5 text-[0.9375rem]" role="alert">
          {state.message}
        </p>
      )}

      <button type="submit" className="btn btn-gold mt-6 w-full" disabled={pending}>
        {pending ? "Envoi en cours…" : "Envoyer ma demande"}
      </button>
      <p className="mt-4 text-center text-[0.8125rem] text-stone">
        Vos coordonnées servent uniquement à vous rappeler.
      </p>
    </form>
  );
}
