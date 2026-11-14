import { getPack, site } from "@/config/site";
import { zonedToUtc } from "@/lib/dates";
import { formatPhone } from "@/lib/phone";
import type { Booking } from "@/lib/bookings";

/** Génération de fichiers iCalendar (.ics), lisibles par Google Agenda, Apple, Outlook. */

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Replie les lignes à 75 octets, comme l'exige la norme. */
function fold(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const chunks: string[] = [];
  let current = "";
  let size = 0;
  for (const char of line) {
    const charSize = Buffer.byteLength(char, "utf8");
    const limit = chunks.length === 0 ? 75 : 74;
    if (size + charSize > limit) {
      chunks.push(current);
      current = "";
      size = 0;
    }
    current += char;
    size += charSize;
  }
  if (current) chunks.push(current);
  return chunks.join("\r\n ");
}

function stamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

type EventMode = "owner" | "customer";

function eventLines(b: Booking, mode: EventMode): string[] {
  if (!b.confirmedDate || !b.confirmedTime) return [];
  const start = zonedToUtc(b.confirmedDate, b.confirmedTime);
  const end = new Date(start.getTime() + b.durationMin * 60_000);
  const pack = getPack(b.packId);

  const summary =
    mode === "owner"
      ? `${b.name}${pack ? ` — ${pack.name}` : ""}`
      : `Rendez-vous ${site.name}${pack ? ` — ${pack.name}` : ""}`;

  const description =
    mode === "owner"
      ? [
          `Tél. : ${formatPhone(b.phone)}`,
          pack ? `Formule : ${pack.name}` : null,
          b.message ? `Client : ${b.message}` : null,
          b.adminNote ? `Note : ${b.adminNote}` : null,
          `Réf. ${b.ref}`,
        ]
          .filter(Boolean)
          .join("\n")
      : `Réf. ${b.ref}\nPour modifier ou annuler : ${site.contact.phoneDisplay}`;

  return [
    "BEGIN:VEVENT",
    `UID:${b.id}@sans-facon`,
    `DTSTAMP:${stamp(new Date(b.updatedAt))}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(site.contact.addressLines.join(", "))}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
  ];
}

export function buildCalendar(bookings: Booking[], mode: EventMode): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sans Facon//Reservations//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(mode === "owner" ? `${site.name} — rendez-vous` : site.name)}`,
    `X-WR-TIMEZONE:${site.timezone}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT30M",
    "X-PUBLISHED-TTL:PT30M",
    ...bookings.flatMap((b) => eventLines(b, mode)),
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** Lien « Ajouter à Google Agenda » pour le client. */
export function googleCalendarLink(b: Booking): string | null {
  if (!b.confirmedDate || !b.confirmedTime) return null;
  const start = zonedToUtc(b.confirmedDate, b.confirmedTime);
  const end = new Date(start.getTime() + b.durationMin * 60_000);
  const pack = getPack(b.packId);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Rendez-vous ${site.name}${pack ? ` — ${pack.name}` : ""}`,
    dates: `${stamp(start)}/${stamp(end)}`,
    location: site.contact.addressLines.join(", "),
    details: `Réf. ${b.ref}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
