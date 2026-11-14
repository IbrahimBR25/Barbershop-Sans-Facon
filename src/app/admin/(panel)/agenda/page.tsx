import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageLoading, PageTitle } from "@/components/admin/PageLoading";
import { WeekView } from "@/components/admin/WeekView";
import { requireAdmin } from "@/lib/auth";
import { listConfirmedBetween, listPendingBetween } from "@/lib/bookings";
import {
  addDays,
  formatDayNumber,
  formatMonth,
  isDateStr,
  startOfWeek,
  todayInTz,
} from "@/lib/dates";

export const metadata: Metadata = { title: "Agenda" };

async function Agenda({ searchParams }: { searchParams: Promise<{ s?: string | string[] }> }) {
  await requireAdmin();
  const { s } = await searchParams;
  const today = todayInTz();
  const monday = startOfWeek(typeof s === "string" && isDateStr(s) ? s : today);
  const sunday = addDays(monday, 6);
  const [confirmed, pending] = await Promise.all([
    listConfirmedBetween(monday, sunday),
    listPendingBetween(monday, sunday),
  ]);

  const range =
    formatMonth(monday, "long") === formatMonth(sunday, "long")
      ? `${formatDayNumber(monday)} – ${formatDayNumber(sunday)} ${formatMonth(sunday, "long")}`
      : `${formatDayNumber(monday)} ${formatMonth(monday, "long")} – ${formatDayNumber(sunday)} ${formatMonth(sunday, "long")}`;

  return (
    <>
      <PageTitle
        title={`Semaine du ${range}`}
        hint={`${confirmed.length} rendez-vous confirmé${confirmed.length > 1 ? "s" : ""} · ${pending.length} demande${pending.length > 1 ? "s" : ""} à confirmer (en pointillés)`}
      />
      <div className="mb-5 flex flex-wrap gap-2.5">
        <Link href={`/admin/agenda?s=${addDays(monday, -7)}`} className="btn btn-ghost btn-sm">
          ← Précédente
        </Link>
        <Link href="/admin/agenda" className="btn btn-ghost btn-sm">
          Cette semaine
        </Link>
        <Link href={`/admin/agenda?s=${addDays(monday, 7)}`} className="btn btn-ghost btn-sm">
          Suivante →
        </Link>
        <Link href="/admin/nouveau" className="btn btn-gold btn-sm sm:ml-auto">
          + Rendez-vous
        </Link>
      </div>
      <WeekView monday={monday} today={today} confirmed={confirmed} pending={pending} />
    </>
  );
}

export default function AgendaPage({ searchParams }: PageProps<"/admin/agenda">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Agenda searchParams={searchParams} />
    </Suspense>
  );
}
