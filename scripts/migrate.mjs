#!/usr/bin/env node
// Applique les fichiers SQL de supabase/migrations sur DATABASE_URL.
// Usage : npm run db:migrate   (lit .env.local)
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL manquant (voir .env.example).");
  process.exit(1);
}
const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
const sql = postgres(url, { max: 1, ssl: isLocal ? false : "require", onnotice: () => {} });
const dir = join(process.cwd(), "supabase", "migrations");

try {
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    process.stdout.write(`→ ${file} … `);
    await sql.unsafe(readFileSync(join(dir, file), "utf8"));
    console.log("ok");
  }
} finally {
  await sql.end();
}
