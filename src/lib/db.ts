import "server-only";
import postgres from "postgres";
import { requireEnv } from "@/lib/env";

type Sql = ReturnType<typeof postgres>;

const globalForDb = globalThis as unknown as { __sfSql?: Sql };

/** Connexion Postgres (Supabase). Jamais importée côté navigateur. */
export function db(): Sql {
  if (!globalForDb.__sfSql) {
    const url = requireEnv("DATABASE_URL");
    const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
    globalForDb.__sfSql = postgres(url, {
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
      // Requis par le pooler Supabase (mode transaction).
      prepare: false,
      ssl: isLocal ? false : "require",
      onnotice: () => {},
    });
  }
  return globalForDb.__sfSql;
}
