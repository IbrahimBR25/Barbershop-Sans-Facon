#!/usr/bin/env node
// Génère la valeur de ADMIN_PASSWORD_HASH à partir d'un mot de passe.
// Usage : npm run hash-password            (saisie masquée)
//         npm run hash-password -- "mot de passe"
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

const N = 32768;
const r = 8;
const p = 1;

async function ask() {
  if (process.argv[2]) return process.argv[2];
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  const question = "Mot de passe du gérant (12 caractères minimum) : ";
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
    // Masque la saisie.
    rl._writeToOutput = (text) => {
      if (text.startsWith(question)) rl.output.write(question);
    };
  });
}

const password = String(await ask());
if (password.length < 12) {
  console.error("Mot de passe trop court : 12 caractères minimum.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 32, { N, r, p, maxmem: 256 * 1024 * 1024 });
console.log("\nAjoutez cette ligne à vos variables d'environnement :\n");
console.log(
  `ADMIN_PASSWORD_HASH=scrypt:${N}:${r}:${p}:${salt.toString("base64url")}:${hash.toString("base64url")}`,
);
console.log("\nAutres secrets à générer (une fois) :\n");
console.log(`AUTH_SECRET=${randomBytes(48).toString("base64url")}`);
console.log(`CALENDAR_FEED_KEY=${randomBytes(24).toString("base64url")}`);
