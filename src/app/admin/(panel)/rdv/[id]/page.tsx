import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cancelAction, deleteAction, reopenAction } from "@/app/actions/admin";
import { getPack, site } from "@/config/site";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { CopyField } from "@/components/admin/CopyField";
import { PageLoading } from "@/components/admin/PageLoading";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PartyList } from "@/components/site/PartyList";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { requireAdmin } from "@/lib/auth";
import { getById } from "@/lib/bookings";
import { addMinutes, formatSlot } from "@/lib/dates";
import { formatPhone, phoneDigits } from "@/lib/phone";
import { timeAgo } from "@/lib/reltime";
import { confirmationLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Rendez-vous" };

const notices: Record<string, string> = {
  confirme: "Rendez-vous confirmé. La page de suivi du client affiche maintenant « Confirmé ».",
  cree: "Rendez-vous ajouté à l'agenda.",
  annule: "Demande annulée.",
  attente: "Demande remise en attente.",
};

async function Detail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fait?: string | string[] }>;
}) {
  await requireAdmin();
  const [{ id }, { fait }] = await Promise.all([params, searchParams]);
  const booking = await getById(id);
  if (!booking) notFound();

  const pack = getPack(booking.packId);
  const isConfirmed = booking.status === "confirmed";
  const notice = typeof fait === "string" ? notices[fait] : undefined;
  const trackingUrl = `${site.url}/reservation/${booking.token}`;

  return (
    <div className="max-w-3xl">
      <Link href="/admin" className="link-gold text-sm">
        ← Retour aux demandes
      </Link>

      {notice && (
        <p className="mt-5 border border-gold/60 bg-gold/10 px-4 py-3 text-[0.9375rem]" role="status">
          {notice}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <StatusBadge status={booking.status} />
        <span className="text-xs tabular-nums tracking-[0.12em] text-stone">{booking.ref}</span>
        <span className="text-xs text-stone">
          · {booking.source === "admin" ? "saisi au salon" : "reçue"} {timeAgo(booking.createdAt)}
        </span>
      </div>
      <h1 className="mt-4 text-4xl font-light sm:text-5xl">{booking.name}</h1>

      <div className="mt-5 grid gap-2.5 sm:flex sm:flex-wrap">
        <a href={`tel:${booking.phone}`} className="btn btn-gold">
          <PhoneIcon width={18} height={18} />
          Appeler · <span className="tabular-nums tracking-[0.08em]">{formatPhone(booking.phone)}</span>
        </a>
        <a
          href={`https://wa.me/${phoneDigits(booking.phone)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          <WhatsAppIcon width={18} height={18} />
          WhatsApp
        </a>
      </div>

      <dl className="card mt-7 divide-y divide-line-soft px-5 sm:px-7">
        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between">
          <dt className="text-[0.6875rem] uppercase tracking-[0.22em] text-stone">Souhait du client</dt>
          <dd>{formatSlot(booking.requestedDate, booking.requestedTime)}</dd>
        </div>
        {isConfirmed && booking.confirmedDate && booking.confirmedTime && (
          <div className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between">
            <dt className="text-[0.6875rem] uppercase tracking-[0.22em] text-stone">Rendez-vous confirmé</dt>
            <dd className="text-gold-soft">
              {formatSlot(booking.confirmedDate, booking.confirmedTime)} →{" "}
              {addMinutes(booking.confirmedTime, booking.durationMin)}
            </dd>
          </div>
        )}
        {booking.party ? (
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:justify-between sm:gap-8">
            <dt className="text-[0.6875rem] uppercase tracking-[0.22em] text-stone">
              {site.cortege.title} · {booking.party.length} personnes
            </dt>
            <dd>
              <PartyList party={booking.party} />
            </dd>
          </div>
        ) : (
          <div className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between">
            <dt className="text-[0.6875rem] uppercase tracking-[0.22em] text-stone">Formule</dt>
            <dd>{pack ? pack.name : "À définir"}</dd>
          </div>
        )}
        {booking.message && (
          <div className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between sm:gap-8">
            <dt className="shrink-0 text-[0.6875rem] uppercase tracking-[0.22em] text-stone">Précision du client</dt>
            <dd className="sm:text-right">« {booking.message} »</dd>
          </div>
        )}
      </dl>

      {isConfirmed && booking.confirmedDate && booking.confirmedTime && (
        <section className="card mt-6 p-5 sm:p-7">
          <h2 className="text-2xl">Prévenir le client</h2>
          <p className="mt-2 text-[0.9375rem] text-sand">
            Envoyez-lui la confirmation écrite. Le message contient sa page de suivi.
          </p>
          <a
            href={confirmationLink({
              name: booking.name,
              phone: booking.phone,
              confirmedDate: booking.confirmedDate,
              confirmedTime: booking.confirmedTime,
              token: booking.token,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp mt-4 w-full sm:w-auto"
          >
            <WhatsAppIcon width={18} height={18} />
            Envoyer la confirmation
          </a>
          <div className="mt-5">
            <p className="label">Page de suivi du client</p>
            <CopyField value={trackingUrl} label="Page de suivi du client" />
          </div>
        </section>
      )}

      {booking.status !== "cancelled" && (
        <section className="card mt-6 p-5 sm:p-7">
          <h2 className="text-2xl">
            {isConfirmed ? "Modifier le rendez-vous" : "Confirmer après l'appel"}
          </h2>
          <p className="mb-6 mt-2 text-[0.9375rem] text-sand">
            {isConfirmed
              ? "Changez la date, l'heure ou la durée si besoin."
              : "Indiquez la date et l'heure convenues au téléphone."}
          </p>
          <ConfirmForm
            id={booking.id}
            isConfirmed={isConfirmed}
            defaults={{
              date: booking.confirmedDate ?? booking.requestedDate,
              time: booking.confirmedTime ?? booking.requestedTime ?? "10:00",
              durationMin: booking.durationMin,
              packId: booking.packId ?? "",
              adminNote: booking.adminNote ?? "",
            }}
          />
        </section>
      )}

      <section className="mt-8 flex flex-wrap gap-3 border-t border-line-soft pt-6">
        {booking.status !== "cancelled" && (
          <form action={cancelAction}>
            <input type="hidden" name="id" value={booking.id} />
            <button type="submit" className="btn btn-danger btn-sm">
              {isConfirmed ? "Annuler le rendez-vous" : "Annuler la demande"}
            </button>
          </form>
        )}
        {booking.status !== "pending" && (
          <form action={reopenAction}>
            <input type="hidden" name="id" value={booking.id} />
            <button type="submit" className="btn btn-ghost btn-sm">
              Remettre en attente
            </button>
          </form>
        )}
        {booking.status === "cancelled" && (
          <form action={deleteAction}>
            <input type="hidden" name="id" value={booking.id} />
            <button type="submit" className="btn btn-danger btn-sm">
              Supprimer définitivement
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default function BookingDetailPage({
  params,
  searchParams,
}: PageProps<"/admin/rdv/[id]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Detail params={params} searchParams={searchParams} />
    </Suspense>
  );
}
