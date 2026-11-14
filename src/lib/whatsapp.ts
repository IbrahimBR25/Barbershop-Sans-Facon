import { getPack, site } from "@/config/site";
import { formatSlot } from "@/lib/dates";
import { formatPhone, phoneDigits } from "@/lib/phone";

type BookingForMessage = {
  ref: string;
  name: string;
  phone: string;
  packId: string | null;
  requestedDate: string;
  requestedTime: string | null;
  message: string | null;
};

function waLink(toE164: string, text: string): string {
  return `https://wa.me/${phoneDigits(toE164)}?text=${encodeURIComponent(text)}`;
}

/** Message que le client envoie au salon (ouvre WhatsApp, pré-rempli). */
export function requestMessage(b: BookingForMessage): string {
  const pack = getPack(b.packId);
  const lines = [
    `Bonjour ${site.name},`,
    "Je souhaite prendre rendez-vous :",
    "",
    `• Nom : ${b.name}`,
    `• Téléphone : ${formatPhone(b.phone)}`,
    `• Formule : ${pack ? pack.name : "À définir ensemble"}`,
    `• Créneau souhaité : ${formatSlot(b.requestedDate, b.requestedTime)}`,
  ];
  if (b.message) lines.push(`• Précision : ${b.message}`);
  lines.push("", `Réf. ${b.ref}`, "Merci de me rappeler pour confirmer.");
  return lines.join("\n");
}

export function requestLink(b: BookingForMessage): string {
  return waLink(site.contact.whatsappE164, requestMessage(b));
}

/** Message que le salon envoie au client une fois le rendez-vous confirmé. */
export function confirmationLink(b: {
  name: string;
  phone: string;
  confirmedDate: string;
  confirmedTime: string;
  token: string;
}): string {
  const firstName = b.name.split(/\s+/)[0];
  const text = [
    `Bonjour ${firstName},`,
    `Votre rendez-vous chez ${site.name} est confirmé : ${formatSlot(b.confirmedDate, b.confirmedTime)}.`,
    "",
    `Suivi de votre rendez-vous : ${site.url}/reservation/${b.token}`,
    "À très bientôt.",
  ].join("\n");
  return waLink(b.phone, text);
}

/** Lien WhatsApp simple vers le salon (bouton de contact). */
export function contactLink(): string {
  return waLink(site.contact.whatsappE164, `Bonjour ${site.name}, `);
}
