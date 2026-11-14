import Link from "next/link";
import { getPack } from "@/config/site";
import type { Booking } from "@/lib/bookings";
import {
  addDays,
  formatDayNumber,
  formatWeekday,
  minutesToTime,
  timeToMinutes,
} from "@/lib/dates";

type Item = {
  booking: Booking;
  kind: "confirmed" | "pending";
  start: number;
  end: number;
  lane: number;
  lanes: number;
};

const HOUR_PX = 60;

/** Répartit en colonnes les rendez-vous qui se chevauchent. */
function layout(items: Item[]): Item[] {
  const sorted = [...items].sort((a, b) => a.start - b.start || a.end - b.end);
  let cluster: Item[] = [];
  let laneEnds: number[] = [];
  let clusterEnd = -1;
  const flush = () => {
    for (const item of cluster) item.lanes = laneEnds.length;
    cluster = [];
    laneEnds = [];
  };
  for (const item of sorted) {
    if (cluster.length > 0 && item.start >= clusterEnd) flush();
    let lane = laneEnds.findIndex((end) => end <= item.start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(item.end);
    } else {
      laneEnds[lane] = item.end;
    }
    item.lane = lane;
    cluster.push(item);
    clusterEnd = Math.max(clusterEnd, item.end);
  }
  flush();
  return sorted;
}

function toItems(confirmed: Booking[], pending: Booking[], day: string): Item[] {
  const items: Item[] = [];
  for (const b of confirmed) {
    if (b.confirmedDate !== day || !b.confirmedTime) continue;
    const start = timeToMinutes(b.confirmedTime);
    items.push({ booking: b, kind: "confirmed", start, end: start + b.durationMin, lane: 0, lanes: 1 });
  }
  for (const b of pending) {
    if (b.requestedDate !== day || !b.requestedTime) continue;
    const start = timeToMinutes(b.requestedTime);
    items.push({ booking: b, kind: "pending", start, end: start + b.durationMin, lane: 0, lanes: 1 });
  }
  return layout(items);
}

function itemLabel(item: Item): string {
  const pack = getPack(item.booking.packId);
  return `${minutesToTime(item.start)} – ${minutesToTime(item.end)} · ${item.booking.name}${
    pack ? ` · ${pack.name}` : ""
  }${item.kind === "pending" ? " (à confirmer)" : ""}`;
}

export function WeekView({
  monday,
  today,
  confirmed,
  pending,
}: {
  monday: string;
  today: string;
  confirmed: Booking[];
  pending: Booking[];
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const perDay = days.map((day) => ({
    day,
    items: toItems(confirmed, pending, day),
    flexible: pending.filter((b) => b.requestedDate === day && !b.requestedTime),
  }));

  const all = perDay.flatMap((d) => d.items);
  const startHour = Math.min(8, ...all.map((i) => Math.floor(i.start / 60)));
  const endHour = Math.max(21, ...all.map((i) => Math.ceil(i.end / 60)));
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const gridHeight = hours.length * HOUR_PX;

  return (
    <>
      {/* Téléphone : liste jour par jour */}
      <div className="space-y-3 lg:hidden">
        {perDay.map(({ day, items, flexible }) => (
          <section
            key={day}
            className={`card p-4 ${day === today ? "border-gold/60" : ""}`}
            aria-label={`${formatWeekday(day, "long")} ${formatDayNumber(day)}`}
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl capitalize">
                {formatWeekday(day, "long")} {formatDayNumber(day)}
                {day === today && (
                  <span className="ml-2 align-middle font-sans text-[0.625rem] uppercase tracking-[0.2em] text-gold">
                    Aujourd&apos;hui
                  </span>
                )}
              </h2>
              <Link
                href={`/admin/nouveau?date=${day}`}
                className="text-2xl leading-none text-gold"
                aria-label="Ajouter un rendez-vous ce jour"
              >
                +
              </Link>
            </div>
            {items.length === 0 && flexible.length === 0 ? (
              <p className="mt-1 text-sm text-stone">Libre</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {items.map((item) => (
                  <li key={item.booking.id}>
                    <Link
                      href={`/admin/rdv/${item.booking.id}`}
                      className={`flex items-baseline gap-3 border px-3 py-2.5 ${
                        item.kind === "confirmed"
                          ? "border-gold/50 bg-gold/10"
                          : "border-dashed border-line text-sand"
                      }`}
                    >
                      <span className="shrink-0 font-display text-lg tabular-nums text-gold-soft">
                        {minutesToTime(item.start)}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{item.booking.name}</span>
                      <span className="shrink-0 text-xs text-stone">
                        {item.kind === "pending"
                          ? "à confirmer"
                          : (getPack(item.booking.packId)?.name ?? "")}
                      </span>
                    </Link>
                  </li>
                ))}
                {flexible.map((b) => (
                  <li key={b.id}>
                    <Link
                      href={`/admin/rdv/${b.id}`}
                      className="flex items-baseline gap-3 border border-dashed border-line px-3 py-2.5 text-sand"
                    >
                      <span className="shrink-0 text-xs uppercase tracking-[0.14em] text-gold">Flexible</span>
                      <span className="min-w-0 flex-1 truncate">{b.name}</span>
                      <span className="shrink-0 text-xs text-stone">à confirmer</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {/* Ordinateur : grille horaire */}
      <div className="card hidden lg:block">
        <div className="grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))] border-b border-line-soft">
          <div />
          {perDay.map(({ day, flexible }) => (
            <div key={day} className="border-l border-line-soft px-2 py-3 text-center">
              <Link
                href={`/admin/nouveau?date=${day}`}
                className="group block"
                title="Ajouter un rendez-vous ce jour"
              >
                <span className="block text-[0.625rem] uppercase tracking-[0.22em] text-stone">
                  {formatWeekday(day, "short")}
                </span>
                <span
                  className={`mx-auto mt-1 flex h-9 w-9 items-center justify-center rounded-full font-display text-xl transition-colors group-hover:text-gold-soft ${
                    day === today ? "bg-gold text-ink" : ""
                  }`}
                >
                  {formatDayNumber(day)}
                </span>
              </Link>
              {flexible.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/rdv/${b.id}`}
                  className="mt-1.5 block truncate border border-dashed border-line px-1.5 py-1 text-left text-xs text-sand hover:border-gold"
                  title={`${b.name} — heure flexible, à confirmer`}
                >
                  {b.name}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))]">
          <div className="relative" style={{ height: gridHeight }}>
            {hours.map((h, i) => (
              <span
                key={h}
                className="absolute right-2 -translate-y-1/2 text-[0.6875rem] tabular-nums text-stone"
                style={{ top: i * HOUR_PX }}
              >
                {i === 0 ? "" : `${String(h).padStart(2, "0")}:00`}
              </span>
            ))}
          </div>
          {perDay.map(({ day, items }) => (
            <div
              key={day}
              className={`relative border-l border-line-soft ${day === today ? "bg-gold/[0.04]" : ""}`}
              style={{
                height: gridHeight,
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0, transparent 59px, #c9a96a1f 59px, #c9a96a1f 60px)",
              }}
            >
              {items.map((item) => {
                const top = ((item.start - startHour * 60) / 60) * HOUR_PX;
                const height = Math.max(((item.end - item.start) / 60) * HOUR_PX - 2, 22);
                const width = 100 / item.lanes;
                return (
                  <Link
                    key={item.booking.id}
                    href={`/admin/rdv/${item.booking.id}`}
                    title={itemLabel(item)}
                    className={`absolute overflow-hidden border px-1.5 py-1 text-xs leading-tight transition-colors ${
                      item.kind === "confirmed"
                        ? "border-gold/70 bg-[#3a2f1a] text-ivory hover:bg-[#4a3c20]"
                        : "border-dashed border-line bg-panel text-sand hover:border-gold"
                    }`}
                    style={{
                      top,
                      height,
                      left: `calc(${item.lane * width}% + 2px)`,
                      width: `calc(${width}% - 4px)`,
                    }}
                  >
                    <span className="block tabular-nums text-gold-soft">
                      {minutesToTime(item.start)}
                    </span>
                    <span className="block truncate font-normal">{item.booking.name}</span>
                    {item.kind === "pending" && (
                      <span className="block truncate text-[0.625rem] uppercase tracking-[0.1em]">
                        à confirmer
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
