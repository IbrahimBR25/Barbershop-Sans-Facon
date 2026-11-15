import { site } from "@/config/site";
import { SectionHeading } from "@/components/site/SectionHeading";

export function Services() {
  return (
    <section id="carte" className="py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          index="03"
          eyebrow="La carte"
          title={
            <>
              Les soins, <span className="display-italic">à l&apos;unité.</span>
            </>
          }
          intro="Pour l'entretien régulier, ou pour compléter une formule."
        />
        <ul className="mt-14 grid border-t border-line md:grid-cols-2 md:gap-x-16 lg:mt-20">
          {site.services.map((service) => (
            <li
              key={service.name}
              className="flex items-baseline justify-between gap-6 border-b border-line-soft py-6"
            >
              <div>
                <h3 className="text-[1.75rem] leading-tight">{service.name}</h3>
                {service.detail && <p className="mt-1 text-sm text-stone">{service.detail}</p>}
              </div>
              <span className="shrink-0 text-sand tabular-nums">
                {service.priceTnd === null ? "—" : `${service.priceTnd} DT`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
