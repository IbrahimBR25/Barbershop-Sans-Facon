"use client";

/** Bouton « Choisir cette formule » : présélectionne la formule dans le formulaire. */
export function PackButton({
  packId,
  className,
  children,
}: {
  packId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#reserver"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("sf:pack", { detail: packId }));
      }}
    >
      {children}
    </a>
  );
}
