"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

const KEY = "sf:last-booking";
const noopSubscribe = () => () => {};

/** Mémorise (dans ce navigateur uniquement) le lien de suivi de la dernière demande. */
export function RememberBooking({ token, active }: { token: string; active: boolean }) {
  useEffect(() => {
    try {
      if (active) window.localStorage.setItem(KEY, token);
      else if (window.localStorage.getItem(KEY) === token) window.localStorage.removeItem(KEY);
    } catch {
      // Stockage indisponible (navigation privée) : sans conséquence.
    }
  }, [token, active]);
  return null;
}

/** Sur l'accueil : rappel discret vers la page de suivi d'une demande en cours. */
export function PendingBanner() {
  const token = useSyncExternalStore(
    noopSubscribe,
    () => {
      try {
        const value = window.localStorage.getItem(KEY);
        return value && /^[A-Za-z0-9_-]{32}$/.test(value) ? value : null;
      } catch {
        return null;
      }
    },
    () => null,
  );
  if (!token) return null;
  return (
    <div className="border-b border-line-soft bg-panel">
      <div className="container-x flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-3 text-center text-sm">
        <span className="text-sand">Vous avez une demande de rendez-vous en cours.</span>
        <Link href={`/reservation/${token}`} className="link-gold">
          Voir où elle en est
        </Link>
      </div>
    </div>
  );
}
