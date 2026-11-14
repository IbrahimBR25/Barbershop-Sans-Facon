"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/admin";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, null);
  return (
    <form action={formAction} className="card mt-10 p-7 text-left sm:p-9">
      <label htmlFor="password" className="label">
        Mot de passe
      </label>
      <input
        id="password"
        name="password"
        type="password"
        className="input"
        autoComplete="current-password"
        maxLength={200}
        required
        autoFocus
        aria-invalid={state?.error ? true : undefined}
        aria-describedby={state?.error ? "login-error" : undefined}
      />
      {state?.error && (
        <p id="login-error" className="field-error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn btn-gold mt-7 w-full" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
