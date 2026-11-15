import Link from "next/link";
import { getPack, site } from "@/config/site";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PartyList } from "@/components/site/PartyList";
import { ArrowIcon, PhoneIcon } from "@/components/ui/icons";
import type { Booking } from "@/lib/bookings";
import { addMinutes, formatSlot } from "@/lib/dates";
import { formatPhone } from "@/lib/phone";
import { timeAgo } from "@/lib/reltime";

export function BookingCard({ booking, now }: { booking: Booking; now: Date }) {
  const pack = getPack(booking.packId);
  const confirmed = booking.status === "confirmed" && booking.confirmedDate && booking.confirmedTime;
  return (
    <article className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={booking.status} />
          {booking.party && (
            <span className="badge badge-pending">
              {site.cortege.title} · {booking.party.length}
            </span>
          )}
          <span className="text-xs tabular-nums tracking-[0.12em] text-stone">{booking.ref}</span>
        </div>
        <span className="text-xs text-stone">
          {booking.source === "admin" ? "Saisi au salon" : "Reçue"} {timeAgo(booking.createdAt, now)}
        </span>
      </div>

      <h3 className="mt-4 text-[1.7rem]">{booking.name}</h3>

      <dl className="mt-3 space-y-1.5 text-[0.9375rem]">
        <div className="flex gap-3">
          <dt className="w-20 shrink-0 text-stone">{confirmed ? "Rendez-vous" : "Souhait"}</dt>
          <dd className={confirmed ? "text-gold-soft" : "text-ivory"}>
            {confirmed
              ? `${formatSlot(booking.confirmedDate!, booking.confirmedTime)} → ${addMinutes(booking.confirmedTime!, booking.durationMin)}`
              : formatSlot(booking.requestedDate, booking.requestedTime)}
          </dd>
        </div>
        {booking.party ? (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 text-stone">Groupe</dt>
            <dd className="text-ivory">
              <PartyList party={booking.party} compact />
            </dd>
          </div>
        ) : (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 text-stone">Formule</dt>
            <dd className="text-sand">{pack ? pack.name : "À définir"}</dd>
          </div>
        )}
        {booking.message && (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 text-stone">Précision</dt>
            <dd className="text-sand">« {booking.message} »</dd>
          </div>
        )}
        {booking.adminNote && (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 text-stone">Note</dt>
            <dd className="text-sand">{booking.adminNote}</dd>
          </div>
        )}
      </dl>

      <div className="mt-5 grid gap-2.5 sm:flex sm:flex-wrap">
        <a
          href={`tel:${booking.phone}`}
          className={`btn btn-sm ${booking.status === "pending" ? "btn-gold" : "btn-ghost"}`}
        >
          <PhoneIcon width={16} height={16} />
          <span className="tabular-nums tracking-[0.08em]">{formatPhone(booking.phone)}</span>
        </a>
        <Link href={`/admin/rdv/${booking.id}`} className="btn btn-ghost btn-sm">
          {booking.status === "pending" ? "Confirmer / traiter" : "Ouvrir"}
          <ArrowIcon width={14} height={14} />
        </Link>
      </div>
    </article>
  );
}
