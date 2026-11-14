import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { requireEnv } from "@/lib/env";

/**
 * Empreinte anonymisée de l'adresse IP du visiteur (HMAC, non réversible).
 * Sert uniquement à limiter les abus : l'IP brute n'est jamais stockée.
 */
export async function clientIpHash(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || h.get("x-real-ip") || "unknown";
  return anonymize(ip);
}

/** Empreinte non réversible d'une valeur (IP, numéro) pour les compteurs anti-abus. */
export function anonymize(value: string): string {
  return createHmac("sha256", requireEnv("AUTH_SECRET", 32)).update(value).digest("hex").slice(0, 32);
}
