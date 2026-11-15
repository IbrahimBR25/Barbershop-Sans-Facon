"use client";

/** Lien qui présélectionne une formule (ou le mode groupe) dans le formulaire de réservation. */
export function PackButton({
  packId,
  cortege = false,
  className,
  children,
}: {
  packId?: string;
  cortege?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#reserver"
      className={className}
      onClick={() => {
        if (cortege) window.dispatchEvent(new CustomEvent("sf:cortege"));
        else if (packId) window.dispatchEvent(new CustomEvent("sf:pack", { detail: packId }));
      }}
    >
      {children}
    </a>
  );
}
