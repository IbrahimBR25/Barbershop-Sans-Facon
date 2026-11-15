import { getPack, site } from "@/config/site";

/** Le Cortège : une réservation pour plusieurs personnes. */

export const PARTY_ROLES = {
  marie: "Le marié",
  temoin: "Témoin",
  frere: "Frère",
  pere: "Père",
  ami: "Ami",
  proche: "Proche",
} as const;

export type PartyRole = keyof typeof PARTY_ROLES;

export type PartyMember = {
  role: PartyRole;
  /** `null` = formule à définir ensemble. */
  packId: string | null;
};

export const COMPANION_ROLES = (Object.keys(PARTY_ROLES) as PartyRole[]).filter((r) => r !== "marie");

export function roleLabel(role: PartyRole): string {
  return PARTY_ROLES[role];
}

/** « Témoin — Le Rituel Signature » */
export function memberLabel(m: PartyMember): string {
  const pack = getPack(m.packId);
  return `${roleLabel(m.role)} — ${pack ? pack.name : "formule à définir"}`;
}

/** Durée totale estimée (minutes), plafonnée à 10 h. */
export function partyDuration(party: PartyMember[]): number {
  const total = party.reduce((sum, m) => sum + (getPack(m.packId)?.durationMin ?? 60), 0);
  return Math.min(Math.max(total, 15), 600);
}

export function maxMembers(): number {
  return site.cortege.maxMembers;
}
