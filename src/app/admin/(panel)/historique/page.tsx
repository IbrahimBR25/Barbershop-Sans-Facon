import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BookingCard } from "@/components/admin/BookingCard";
import { PageLoading, PageTitle } from "@/components/admin/PageLoading";
import { requireAdmin } from "@/lib/auth";
import { listRecent, type BookingStatus } from "@/lib/bookings";

export const metadata: Metadata = { title: "Historique" };

const filters: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "pending", label: "À appeler" },
  { value: "confirmed", label: "Confirmés" },
  { value: "cancelled", label: "Annulés" },
];

async function History({
  searchParams,
}: {
  searchParams: Promise<{
    statut?: string | string[];
    q?: string | string[];
    fait?: string | string[];
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const status = filters.find((f) => f.value === params.statut)?.value ?? "all";
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 60) : "";
  const bookings = await listRecent(status, q || null, 100);
  const now = new Date();

  return (
    <>
      <PageTitle title="Historique" hint="Les 100 dernières demandes et rendez-vous." />
      {params.fait === "supprime" && (
        <p className="mb-5 border border-gold/60 bg-gold/10 px-4 py-3 text-[0.9375rem]" role="status">
          Demande supprimée définitivement.
        </p>
      )}
      <form method="get" className="mb-4 flex flex-col gap-2.5 sm:flex-row">
        {status !== "all" && <input type="hidden" name="statut" value={status} />}
        <label htmlFor="q" className="sr-only">
          Rechercher
        </label>
        <input
          id="q"
          name="q"
          type="search"
          className="input sm:max-w-sm"
          placeholder="Nom, téléphone ou référence"
          defaultValue={q}
          maxLength={60}
        />
        <button type="submit" className="btn btn-ghost btn-sm">
          Rechercher
        </button>
      </form>
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const query = new URLSearchParams();
          if (f.value !== "all") query.set("statut", f.value);
          if (q) query.set("q", q);
          const qs = query.toString();
          return (
            <Link
              key={f.value}
              href={`/admin/historique${qs ? `?${qs}` : ""}`}
              className="chip"
              aria-current={f.value === status ? "true" : undefined}
            >
              {f.label}
            </Link>
          );
        })}
      </div>
      {bookings.length === 0 ? (
        <p className="card p-8 text-center text-sand">Aucun résultat.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} now={now} />
          ))}
        </div>
      )}
    </>
  );
}

export default function HistoryPage({ searchParams }: PageProps<"/admin/historique">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <History searchParams={searchParams} />
    </Suspense>
  );
}
