import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getPack } from "@/config/site";
import { BookingCard } from "@/components/admin/BookingCard";
import { PageLoading, PageTitle } from "@/components/admin/PageLoading";
import { requireAdmin } from "@/lib/auth";
import { listConfirmedBetween, listPending } from "@/lib/bookings";
import { addMinutes, formatDateLong, todayInTz } from "@/lib/dates";

export const metadata: Metadata = { title: "Demandes" };

async function Dashboard() {
  await requireAdmin();
  const now = new Date();
  const today = todayInTz(now);
  const [pending, todays] = await Promise.all([listPending(), listConfirmedBetween(today, today)]);

  return (
    <>
      <PageTitle
        title="Demandes à traiter"
        hint="Appelez le client, fixez l'heure, puis confirmez ici. Sa page de suivi passe alors à « Confirmé »."
      />

      <section aria-labelledby="today-title" className="card mb-8 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="today-title" className="text-2xl">
            Aujourd&apos;hui · {formatDateLong(today)}
          </h2>
          <Link href="/admin/agenda" className="link-gold text-sm">
            Voir l&apos;agenda
          </Link>
        </div>
        {todays.length === 0 ? (
          <p className="mt-3 text-[0.9375rem] text-stone">Aucun rendez-vous confirmé aujourd&apos;hui.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line-soft">
            {todays.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/admin/rdv/${b.id}`}
                  className="flex items-baseline gap-4 py-3 transition-colors hover:text-gold-soft"
                >
                  <span className="w-28 shrink-0 font-display text-xl tabular-nums text-gold-soft">
                    {b.confirmedTime} – {addMinutes(b.confirmedTime!, b.durationMin)}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{b.name}</span>
                  <span className="hidden shrink-0 text-sm text-stone sm:block">
                    {getPack(b.packId)?.name ?? ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {pending.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-display text-3xl">Tout est à jour.</p>
          <p className="mt-2 text-sand">Aucune demande en attente.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {pending.map((b) => (
            <BookingCard key={b.id} booking={b} now={now} />
          ))}
        </div>
      )}
    </>
  );
}

export default function AdminHome() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Dashboard />
    </Suspense>
  );
}
