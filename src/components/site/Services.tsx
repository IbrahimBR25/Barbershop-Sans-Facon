import { site } from "@/config/site";
import { SectionHeading } from "@/components/site/SectionHeading";

export function Services() {
  return (
    <section id="carte" className="border-y border-line-soft bg-coal py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="La carte"
          title={
            <>
              Les soins, <span className="display-italic">à l&apos;unité</span>
            </>
          }
        />

        <ul className="mx-auto mt-14 grid max-w-5xl gap-x-16 md:grid-cols-2">
          {site.services.map((service) => (
            <li key={service.name} className="border-b border-line-soft py-5">
              <div className="flex items-baseline gap-4">
                <h3 className="font-display text-[1.45rem] leading-tight">{service.name}</h3>
                <span
                  aria-hidden
                  className="mb-1 min-w-6 flex-1 border-b border-dotted border-stone/50"
                />
                <span className="font-display text-xl text-gold-soft">
                  {service.priceTnd === null ? "—" : `${service.priceTnd} DT`}
                </span>
              </div>
              {service.detail && <p className="mt-1 text-sm text-stone">{service.detail}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
