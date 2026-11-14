import type { Metadata } from "next";
import { Suspense } from "react";
import { ManualForm } from "@/components/admin/ManualForm";
import { PageLoading, PageTitle } from "@/components/admin/PageLoading";
import { requireAdmin } from "@/lib/auth";
import { isDateStr, todayInTz } from "@/lib/dates";

export const metadata: Metadata = { title: "Nouveau rendez-vous" };

async function NewBooking({ searchParams }: { searchParams: Promise<{ date?: string | string[] }> }) {
  await requireAdmin();
  const { date } = await searchParams;
  const defaultDate = typeof date === "string" && isDateStr(date) ? date : todayInTz();
  return (
    <div className="max-w-3xl">
      <PageTitle
        title="Nouveau rendez-vous"
        hint="Pour un client au téléphone ou sur place. Le rendez-vous est confirmé d'emblée et apparaît dans l'agenda."
      />
      <ManualForm defaultDate={defaultDate} />
    </div>
  );
}

export default function NewBookingPage({ searchParams }: PageProps<"/admin/nouveau">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <NewBooking searchParams={searchParams} />
    </Suspense>
  );
}
