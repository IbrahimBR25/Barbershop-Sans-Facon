import { site } from "@/config/site";

export function Faq() {
  return (
    <section id="questions" className="border-t border-line-soft py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
        <div>
          <div className="flex items-baseline gap-5 border-t border-line pt-5">
            <span className="index">06</span>
            <span className="eyebrow">Questions</span>
          </div>
          <h2 className="mt-10 text-5xl sm:text-6xl">
            Bon <span className="display-italic">à savoir.</span>
          </h2>
        </div>
        <div className="border-t border-line">
          {site.faq.map((item) => (
            <details key={item.q} className="group border-b border-line-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[1.0625rem] transition-colors hover:text-gold-soft [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="relative h-3 w-3 shrink-0 text-sand before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-current after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
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
