import "server-only";
import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { requireEnv } from "@/lib/env";

/**
 * Authentification de l'espace gérant.
 * - Un seul compte : le mot de passe est stocké sous forme d'empreinte scrypt
 *   dans ADMIN_PASSWORD_HASH (générée par `npm run hash-password`).
 * - La session est un cookie signé (HMAC-SHA256 avec AUTH_SECRET), httpOnly,
 *   limité au chemin /admin. Changer AUTH_SECRET déconnecte tout le monde.
 */

const COOKIE_NAME = "sf_admin";
const SESSION_DAYS = 14;

function sign(payload: string): string {
  return createHmac("sha256", requireEnv("AUTH_SECRET", 32)).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Comparaison en temps constant de deux secrets. */
export function secretsMatch(a: string, b: string): boolean {
  const ha = createHmac("sha256", "sf-compare").update(a).digest();
  const hb = createHmac("sha256", "sf-compare").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function scryptAsync(
  password: string,
  salt: Buffer,
  keylen: number,
  params: { N: number; r: number; p: number },
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, { ...params, maxmem: 256 * 1024 * 1024 }, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

/** Format : scrypt:N:r:p:<sel base64url>:<empreinte base64url> */
export async function verifyPassword(password: string): Promise<boolean> {
  const stored = requireEnv("ADMIN_PASSWORD_HASH");
  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") {
    throw new Error("ADMIN_PASSWORD_HASH invalide. Générez-le avec `npm run hash-password`.");
  }
  const [, n, r, p, saltB64, hashB64] = parts;
  const expected = Buffer.from(hashB64, "base64url");
  const actual = await scryptAsync(password, Buffer.from(saltB64, "base64url"), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function createSession(): Promise<void> {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${expires}.${randomBytes(12).toString("base64url")}`;
  const jar = await cookies();
  jar.set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires: new Date(expires),
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 0,
  });
}

export async function isAdmin(): Promise<boolean> {
  // La session dépend de l'heure : toujours évaluée au moment de la requête.
  await connection();
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;
  const lastDot = value.lastIndexOf(".");
  if (lastDot < 0) return false;
  const payload = value.slice(0, lastDot);
  const signature = value.slice(lastDot + 1);
  if (!safeEqual(signature, sign(payload))) return false;
  const expires = Number(payload.split(".")[0]);
  return Number.isFinite(expires) && expires > Date.now();
}

/**
 * À appeler au début de CHAQUE page et de CHAQUE action de l'espace gérant.
 * Redirige vers la page de connexion si la session est absente ou expirée.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/connexion");
}
