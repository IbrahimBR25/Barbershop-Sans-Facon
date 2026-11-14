import { site } from "@/config/site";

/** Outils de dates. Toutes les dates « jour » sont des chaînes AAAA-MM-JJ, les heures HH:MM. */

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isDateStr(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function isTimeStr(value: unknown): value is string {
  return typeof value === "string" && TIME_RE.test(value);
}

/** Date du jour dans le fuseau du salon. */
export function todayInTz(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: site.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return parts; // en-CA => AAAA-MM-JJ
}

/** Heure actuelle (HH:MM) dans le fuseau du salon. */
export function nowTimeInTz(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 = dimanche … 6 = samedi. */
export function weekdayOf(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

/** Lundi de la semaine contenant `date`. */
export function startOfWeek(date: string): string {
  const wd = weekdayOf(date);
  return addDays(date, wd === 0 ? -6 : 1 - wd);
}

export function isClosedDay(date: string): boolean {
  return site.booking.closedWeekdays.includes(weekdayOf(date));
}

function fmt(date: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", ...options }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

/** « samedi 21 novembre » */
export function formatDateLong(date: string): string {
  return fmt(date, { weekday: "long", day: "numeric", month: "long" });
}

/** « sam. 21 nov. » */
export function formatDateShort(date: string): string {
  return fmt(date, { weekday: "short", day: "numeric", month: "short" });
}

export function formatWeekday(date: string, style: "long" | "short" = "short"): string {
  return fmt(date, { weekday: style });
}

export function formatDayNumber(date: string): string {
  return fmt(date, { day: "numeric" });
}

export function formatMonth(date: string, style: "long" | "short" = "short"): string {
  return fmt(date, { month: style });
}

/** « samedi 21 novembre à 14:00 » ou « samedi 21 novembre (heure flexible) » */
export function formatSlot(date: string, time: string | null): string {
  return time ? `${formatDateLong(date)} à ${time}` : `${formatDateLong(date)} (heure flexible)`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(total: number): string {
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function addMinutes(time: string, minutes: number): string {
  return minutesToTime(timeToMinutes(time) + minutes);
}

/** Créneaux proposés dans le formulaire public. */
export function bookingSlots(): string[] {
  const { firstSlot, lastSlot, stepMin } = site.booking;
  const out: string[] = [];
  for (let t = timeToMinutes(firstSlot); t <= timeToMinutes(lastSlot); t += stepMin) {
    out.push(minutesToTime(t));
  }
  return out;
}

/** Convertit une date + heure locales du salon en instant UTC. */
export function zonedToUtc(date: string, time: string): Date {
  const asUtc = new Date(`${date}T${time}:00Z`);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(asUtc);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const shown = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"));
  const offsetMs = shown - asUtc.getTime();
  return new Date(asUtc.getTime() - offsetMs);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}
