"use client";

import { useState } from "react";

/** Champ en lecture seule avec bouton « Copier ». */
export function CopyField({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        readOnly
        value={value}
        aria-label={label}
        className="input min-w-0 flex-1 text-sm"
        onFocus={(e) => e.currentTarget.select()}
      />
      <button
        type="button"
        className="btn btn-ghost btn-sm shrink-0"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            // Presse-papiers indisponible : l'utilisateur peut copier à la main.
          }
        }}
      >
        {copied ? "Copié" : "Copier"}
      </button>
    </div>
  );
}
