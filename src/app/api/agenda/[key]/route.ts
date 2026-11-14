import { secretsMatch } from "@/lib/auth";
import { listConfirmedBetween } from "@/lib/bookings";
import { addDays, todayInTz } from "@/lib/dates";
import { requireEnv } from "@/lib/env";
import { buildCalendar } from "@/lib/ics";
import { isRateLimited } from "@/lib/ratelimit";
import { clientIpHash } from "@/lib/request";

/**
 * Flux d'agenda privé du gérant (abonnement Google Agenda / Apple Calendrier).
 * L'adresse contient une clé secrète (CALENDAR_FEED_KEY) : elle ne doit être
 * partagée avec personne. Pour la révoquer, changer la clé.
 */
export async function GET(_request: Request, ctx: RouteContext<"/api/agenda/[key]">) {
  const { key } = await ctx.params;
  const expected = requireEnv("CALENDAR_FEED_KEY", 24);

  if (!secretsMatch(key.replace(/\.ics$/, ""), expected)) {
    // Freine les essais de clés au hasard.
    await isRateLimited(`feed:${await clientIpHash()}`, 900, 1000).catch(() => {});
    return new Response("Introuvable", { status: 404 });
  }
  if (await isRateLimited(`feed-ok:${await clientIpHash()}`, 3600, 240)) {
    return new Response("Trop de requêtes", { status: 429 });
  }

  const today = todayInTz();
  const bookings = await listConfirmedBetween(addDays(today, -60), addDays(today, 365));
  return new Response(buildCalendar(bookings, "owner"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="sans-facon.ics"',
      "Cache-Control": "private, no-store",
    },
  });
}
