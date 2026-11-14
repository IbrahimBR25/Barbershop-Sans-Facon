import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { getPack, site } from "@/config/site";
import { AutoRefresh } from "@/components/site/AutoRefresh";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { RememberBooking } from "@/components/site/PendingBanner";
import { CalendarIcon, CheckIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/icons";
import { getByToken, type Booking } from "@/lib/bookings";
import { addMinutes, formatDateLong, formatDuration, formatSlot, todayInTz } from "@/lib/dates";
import { googleCalendarLink } from "@/lib/ics";
import { maskPhone } from "@/lib/phone";
import { requestLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Votre rendez-vous",
  robots: { index: false, follow: false },
};

function firstName(name: string): string {
  return name.split(/\s+/)[0];
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line-soft py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="text-[0.6875rem] uppercase tracking-[0.24em] text-stone">{label}</dt>
      <dd className="text-ivory sm:text-right">{children}</dd>
    </div>
  );
}

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Demande envoyée", "Nous vous appelons", "Rendez-vous confirmé"];
  return (
    <ol className="mt-10 grid grid-cols-3 gap-2 text-center">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current || current === 3;
        const active = n === current && current !== 3;
        return (
          <li key={label} className="relative">
            {i > 0 && (
              <span
                aria-hidden
                className={`absolute right-1/2 top-4 h-px w-full ${done || active ? "bg-gold" : "bg-line"}`}
              />
            )}
            <span
              className={`relative mx-auto flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
                done
                  ? "border-gold bg-gold text-ink"
                  : active
                    ? "border-gold bg-ink text-gold-soft"
                    : "border-line bg-ink text-stone"
              }`}
            >
              {done ? <CheckIcon width={16} height={16} /> : n}
            </span>
            <span
              className={`mt-3 block text-[0.6875rem] uppercase leading-snug tracking-[0.16em] ${
                done || active ? "text-ivory" : "text-stone"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Pending({ booking }: { booking: Booking }) {
  const pack = getPack(booking.packId);
  return (
    <>
      <span className="badge badge-pending">
        <span className="pulse-dot" aria-hidden />
        En attente de confirmation
      </span>
      <h1 className="mt-7 text-4xl font-light sm:text-6xl">
        Demande bien reçue, <span className="display-italic">{firstName(booking.name)}.</span>
      </h1>

      <div className="mt-8 border border-gold/60 bg-panel p-6 sm:p-8">
        <p className="eyebrow">Important</p>
        <p className="mt-3 font-display text-2xl leading-snug sm:text-[1.75rem]">
          Votre créneau n&apos;est pas encore confirmé.
        </p>
        <p className="mt-3 text-sand">
          Nous vous appelons au{" "}
          <span className="whitespace-nowrap text-ivory">{maskPhone(booking.phone)}</span> pour
          fixer l&apos;heure ensemble. Le rendez-vous est réservé uniquement après cet appel.
        </p>
      </div>

      <div className="mt-8">
        <a
          href={requestLink(booking)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp w-full"
        >
          <WhatsAppIcon />
          Envoyer ma demande sur WhatsApp
        </a>
        <p className="mt-3 text-center text-sm text-sand">
          Dernière étape : le message est déjà écrit, il suffit d&apos;appuyer sur « Envoyer »
          dans WhatsApp.
        </p>
        <p className="mt-1 text-center text-[0.8125rem] text-stone">
          Pas de WhatsApp ? Votre demande nous est déjà parvenue, nous vous rappelons.
        </p>
      </div>

      <Steps current={2} />

      <dl className="card mt-10 px-6 sm:px-8">
        <Row label="Créneau souhaité">
          {formatSlot(booking.requestedDate, booking.requestedTime)}
          <span className="block text-sm text-gold-soft">Non confirmé</span>
        </Row>
        <Row label="Formule">{pack ? pack.name : "À définir ensemble"}</Row>
        <Row label="Référence">
          <span className="tabular-nums tracking-[0.12em]">{booking.ref}</span>
        </Row>
      </dl>

      <p className="mt-8 text-center text-sm text-stone">
        Gardez cette page : elle se met à jour dès que votre rendez-vous est confirmé.
      </p>
      <AutoRefresh />
    </>
  );
}

function Confirmed({ booking }: { booking: Booking }) {
  const pack = getPack(booking.packId);
  const date = booking.confirmedDate!;
  const time = booking.confirmedTime!;
  const past = date < todayInTz();
  const google = googleCalendarLink(booking);
  return (
    <>
      <span className="badge badge-confirmed">
        <CheckIcon width={14} height={14} />
        Rendez-vous confirmé
      </span>
      <h1 className="mt-7 text-4xl font-light sm:text-6xl">
        {past ? "Merci de votre visite, " : "C'est confirmé, "}
        <span className="display-italic">{firstName(booking.name)}.</span>
      </h1>

      <div className="mt-8 border border-gold bg-panel p-7 text-center sm:p-10">
        <p className="eyebrow">Votre rendez-vous</p>
        <p className="mt-4 font-display text-4xl leading-tight first-letter:uppercase sm:text-5xl">
          {formatDateLong(date)}
        </p>
        <p className="mt-2 font-display text-5xl tabular-nums text-gold-soft sm:text-6xl">{time}</p>
        <p className="mt-4 text-sm text-sand">
          Jusqu&apos;à {addMinutes(time, booking.durationMin)} environ ·{" "}
          {formatDuration(booking.durationMin)}
        </p>
      </div>

      <Steps current={3} />

      <dl className="card mt-10 px-6 sm:px-8">
        <Row label="Formule">{pack ? pack.name : "À définir sur place"}</Row>
        <Row label="Adresse">
          {site.contact.addressLines.join(", ")}
          {site.contact.mapsUrl && (
            <a
              href={site.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-gold mt-1 flex items-center gap-1.5 text-sm sm:justify-end"
            >
              <PinIcon width={14} height={14} />
              Itinéraire
            </a>
          )}
        </Row>
        <Row label="Référence">
          <span className="tabular-nums tracking-[0.12em]">{booking.ref}</span>
        </Row>
      </dl>

      {!past && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <a href={`/reservation/${booking.token}/rdv.ics`} className="btn btn-gold">
            <CalendarIcon width={18} height={18} />
            Ajouter à mon agenda
          </a>
          {google && (
            <a href={google} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Google Agenda
            </a>
          )}
        </div>
      )}

      <p className="mt-8 text-center text-sm text-sand">
        Un empêchement ? Prévenez-nous au{" "}
        <a href={`tel:${site.contact.phoneE164}`} className="link-gold whitespace-nowrap">
          {site.contact.phoneDisplay}
        </a>
        .
      </p>
      {!past && <AutoRefresh seconds={120} />}
    </>
  );
}

function Cancelled({ booking }: { booking: Booking }) {
  return (
    <>
      <span className="badge badge-cancelled">Demande annulée</span>
      <h1 className="mt-7 text-4xl font-light sm:text-6xl">
        Cette demande <span className="display-italic">a été annulée.</span>
      </h1>
      <p className="mt-6 text-sand">
        La demande {booking.ref} n&apos;est plus active. Vous pouvez en envoyer une nouvelle ou
        nous appeler directement.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link href="/#reserver" className="btn btn-gold">
          Nouvelle demande
        </Link>
        <a href={`tel:${site.contact.phoneE164}`} className="btn btn-ghost">
          <PhoneIcon width={18} height={18} />
          Appeler le salon
        </a>
      </div>
    </>
  );
}

async function Status({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  // Toujours rendu au moment de la requête : l'état peut changer à tout instant.
  await connection();
  const booking = await getByToken(token);
  if (!booking) notFound();

  return (
    <>
      <RememberBooking token={booking.token} active={booking.status !== "cancelled"} />
      {booking.status === "pending" && <Pending booking={booking} />}
      {booking.status === "confirmed" && <Confirmed booking={booking} />}
      {booking.status === "cancelled" && <Cancelled booking={booking} />}
    </>
  );
}

function Loading() {
  return (
    <div aria-busy className="animate-pulse">
      <div className="h-8 w-56 bg-panel" />
      <div className="mt-7 h-14 w-full max-w-md bg-panel" />
      <div className="mt-8 h-40 w-full bg-panel" />
      <p className="sr-only">Chargement de votre demande…</p>
    </div>
  );
}

export default function ReservationPage({ params }: PageProps<"/reservation/[token]">) {
  return (
    <>
      <Header minimal />
      <main className="glow-top flex-1">
        <div className="container-x max-w-2xl py-14 sm:py-20">
          <Suspense fallback={<Loading />}>
            <Status params={params} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
