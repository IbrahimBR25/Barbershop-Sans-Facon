import { site } from "@/config/site";
import { SectionHeading } from "@/components/site/SectionHeading";

export function Faq() {
  return (
    <section id="questions" className="border-t border-line-soft bg-coal py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow="Questions fréquentes" title="Bon à savoir" />
        <div className="mx-auto mt-14 max-w-3xl border-t border-line-soft">
          {site.faq.map((item) => (
            <details key={item.q} className="group border-b border-line-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-[1.45rem] leading-snug transition-colors hover:text-gold-soft [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="relative h-3.5 w-3.5 shrink-0 text-gold before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-current after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
                />
              </summary>
              <p className="pb-7 pr-10 text-sand">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
