import type { ReactNode } from "react";

/** En-tête de section : numéro, libellé, grand titre et texte d'introduction. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-5 border-t border-line pt-5">
        <span className="index">{index}</span>
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-20">
        <h2 className="text-5xl sm:text-6xl lg:text-[4.75rem]">{title}</h2>
        {intro && <p className="max-w-md text-sand lg:pb-2">{intro}</p>}
      </div>
    </div>
  );
}
