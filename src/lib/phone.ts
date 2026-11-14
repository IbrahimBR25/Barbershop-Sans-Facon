/**
 * Normalise un numéro saisi par un client.
 * - 8 chiffres            → numéro tunisien (+216…)
 * - « +… » ou « 00… »     → numéro international (clients de l'étranger)
 * Retourne le format E.164 (« +21622333444 ») ou null si invalide.
 */
export function normalizePhone(input: string): string | null {
  const raw = input.trim();
  if (raw.length > 30) return null;
  if (!/^[+\d\s().-]+$/.test(raw)) return null;

  const digits = raw.replace(/\D/g, "");
  let e164: string;

  if (raw.startsWith("+")) {
    e164 = `+${digits}`;
  } else if (digits.startsWith("00")) {
    e164 = `+${digits.slice(2)}`;
  } else if (digits.length === 8) {
    e164 = `+216${digits}`;
  } else if (digits.length === 11 && digits.startsWith("216")) {
    e164 = `+${digits}`;
  } else {
    return null;
  }

  if (!/^\+[1-9]\d{7,14}$/.test(e164)) return null;
  if (e164.startsWith("+216")) {
    // Tunisie : 8 chiffres, commençant par 2, 3, 4, 5, 7 ou 9.
    if (!/^\+216[234579]\d{7}$/.test(e164)) return null;
  }
  return e164;
}

/** « +216 22 333 444 » pour la Tunisie, sinon groupes de 2–3 chiffres. */
export function formatPhone(e164: string): string {
  const tn = /^\+216(\d{2})(\d{3})(\d{3})$/.exec(e164);
  if (tn) return `+216 ${tn[1]} ${tn[2]} ${tn[3]}`;
  return e164.replace(/^(\+\d{1,3})(\d+)$/, (_, cc: string, rest: string) => {
    return `${cc} ${rest.replace(/(\d{2,3})(?=\d{2})/g, "$1 ").trim()}`;
  });
}

/** Masque le numéro pour l'affichage public : « •• ••• 444 ». */
export function maskPhone(e164: string): string {
  return `•• ••• ${e164.slice(-3)}`;
}

/** Chiffres seuls, pour les liens wa.me. */
export function phoneDigits(e164: string): string {
  return e164.replace(/\D/g, "");
}
