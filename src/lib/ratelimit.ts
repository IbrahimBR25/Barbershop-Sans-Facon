import "server-only";
import { db } from "@/lib/db";

/**
 * Compteur à fenêtre fixe, stocké en base (fonctionne aussi en serverless,
 * où la mémoire n'est pas partagée entre les instances).
 * Retourne true si la limite est dépassée.
 */
export async function isRateLimited(
  key: string,
  windowSeconds: number,
  max: number,
): Promise<boolean> {
  const sql = db();
  const rows = await sql<{ count: number }[]>`
    insert into rate_limits (key, window_start, count)
    values (
      ${key},
      to_timestamp(floor(extract(epoch from now()) / ${windowSeconds}) * ${windowSeconds}),
      1
    )
    on conflict (key, window_start)
    do update set count = rate_limits.count + 1
    returning count
  `;
  // Nettoyage occasionnel des anciennes fenêtres.
  if (Math.random() < 0.02) {
    await sql`delete from rate_limits where window_start < now() - interval '2 days'`.catch(
      () => {},
    );
  }
  return (rows[0]?.count ?? 1) > max;
}
