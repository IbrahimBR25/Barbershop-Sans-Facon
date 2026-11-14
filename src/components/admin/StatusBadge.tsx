import type { BookingStatus } from "@/lib/bookings";

const labels: Record<BookingStatus, string> = {
  pending: "À appeler",
  confirmed: "Confirmé",
  cancelled: "Annulé",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`badge badge-${status}`}>{labels[status]}</span>;
}
