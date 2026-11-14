import "server-only";

/** Lit une variable d'environnement obligatoire, avec un message clair si elle manque. */
export function requireEnv(name: string, minLength = 1): string {
  const value = process.env[name];
  if (!value || value.length < minLength) {
    throw new Error(
      `Variable d'environnement ${name} manquante ou trop courte. Voir .env.example.`,
    );
  }
  return value;
}
