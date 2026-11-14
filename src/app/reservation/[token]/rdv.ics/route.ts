import { getByToken } from "@/lib/bookings";
import { buildCalendar } from "@/lib/ics";

/** Fichier .ics du rendez-vous confirmé, pour l'agenda du client. */
export async function GET(_request: Request, ctx: RouteContext<"/reservation/[token]/rdv.ics">) {
  const { token } = await ctx.params;
  const booking = await getByToken(token);
  if (!booking || booking.status !== "confirmed") {
    return new Response("Introuvable", { status: 404 });
  }
  return new Response(buildCalendar([booking], "customer"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="rendez-vous-sans-facon.ics"',
      "Cache-Control": "private, no-store",
    },
  });
}
