import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-5 text-4xl font-light sm:text-5xl lg:text-[3.4rem]">{title}</h2>
      {centered && (
        <div className="ornament mt-7" aria-hidden>
          <span />
        </div>
      )}
      {intro && <p className={`text-sand ${centered ? "mt-7" : "mt-6"}`}>{intro}</p>}
    </div>
  );
}
