"use server";

import { redirect } from "next/navigation";
import { getPack, site } from "@/config/site";
import { createRequest, findRecentDuplicate } from "@/lib/bookings";
import { nowTimeInTz, todayInTz } from "@/lib/dates";
import { partyDuration } from "@/lib/party";
import { isRateLimited } from "@/lib/ratelimit";
import { anonymize, clientIpHash } from "@/lib/request";
import { field, fieldErrors, requestSchema, type FieldErrors } from "@/lib/validation";

export type RequestState = {
  errors: FieldErrors;
  /** Message général (limite atteinte, panne…). */
  message?: string;
} | null;

const GENERIC_ERROR =
  "L'envoi n'a pas abouti. Réessayez dans un instant ou appelez-nous directement.";

/** Reçoit le formulaire public de demande de rendez-vous. */
export async function submitRequest(_prev: RequestState, formData: FormData): Promise<RequestState> {
  // Champ piège : invisible pour un humain, rempli par les robots.
  if (field(formData, "website") !== "") {
    return { errors: {}, message: GENERIC_ERROR };
  }

  const parsed = requestSchema.safeParse({
    name: field(formData, "name"),
    phone: field(formData, "phone"),
    packId: field(formData, "packId"),
    date: field(formData, "date"),
    time: field(formData, "time"),
    message: field(formData, "message"),
    party: field(formData, "party"),
  });
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error) };
  }
  const input = parsed.data;

  if (input.date === todayInTz()) {
    const now = nowTimeInTz();
    if (now >= site.booking.lastSlot) {
      return { errors: { date: "Il est trop tard pour aujourd'hui. Choisissez un autre jour." } };
    }
    if (input.time && input.time <= now) {
      return { errors: { time: "Cette heure est déjà passée. Choisissez-en une autre." } };
    }
  }

  let token: string;
  try {
    const ipHash = await clientIpHash();

    // Limites anti-abus : par adresse IP, par numéro, et plafond global.
    // La limite par IP reste large : en Tunisie, de nombreux abonnés mobiles
    // partagent la même adresse (CGNAT).
    const [byIp, byPhone, global] = await Promise.all([
      isRateLimited(`req:ip:${ipHash}`, 3600, 20),
      isRateLimited(`req:tel:${anonymize(input.phone)}`, 86400, 4),
      isRateLimited("req:global", 86400, 400),
    ]);
    if (byIp || byPhone || global) {
      return {
        errors: {},
        message:
          "Vous avez déjà envoyé plusieurs demandes. Pour toute précision, appelez-nous directement.",
      };
    }

    const duplicate = await findRecentDuplicate(input.phone, input.date);
    const booking =
      duplicate ??
      (await createRequest({
        name: input.name,
        phone: input.phone,
        // En groupe, la formule principale est celle du marié (ou de la première personne).
        packId: input.party
          ? (input.party.find((m) => m.role === "marie") ?? input.party[0]).packId
          : input.packId,
        requestedDate: input.date,
        requestedTime: input.time,
        message: input.message,
        durationMin: input.party
          ? partyDuration(input.party)
          : (getPack(input.packId)?.durationMin ?? 60),
        ipHash,
        party: input.party,
      }));
    token = booking.token;
  } catch (error) {
    console.error("[reservation] échec de l'enregistrement :", (error as Error).message);
    return { errors: {}, message: GENERIC_ERROR };
  }

  redirect(`/reservation/${token}`);
}
