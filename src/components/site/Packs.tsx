import { formatPrice, site, type Pack } from "@/config/site";
import { PackButton } from "@/components/site/PackButton";
import { SectionHeading } from "@/components/site/SectionHeading";
import { formatDuration } from "@/lib/dates";

function PackRow({ pack }: { pack: Pack }) {
  return (
    <li className="group grid gap-6 border-b border-line-soft py-9 transition-colors lg:grid-cols-[4rem_1.2fr_1.3fr_auto] lg:gap-10 lg:py-11">
      <span className="font-display text-2xl italic text-stone">{pack.numeral}</span>

      <div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h3 className="text-[2.4rem] leading-none sm:text-5xl">{pack.name}</h3>
          {pack.featured && <span className="badge badge-pending">Le plus demandé</span>}
        </div>
        <p className="mt-3 text-[0.6875rem] uppercase tracking-[0.18em] text-gold">{pack.tagline}</p>
        <p className="mt-4 max-w-md text-[0.9375rem] text-sand">{pack.description}</p>
      </div>

      <ul className="space-y-2 text-[0.9375rem] text-sand lg:pt-2">
        {pack.includes.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden className="mt-[0.8em] h-px w-3 shrink-0 bg-stone" />
            {item}
          </li>
        ))}
      </ul>

      <div className="flex flex-row items-end justify-between gap-6 lg:flex-col lg:items-end lg:justify-between lg:pt-2 lg:text-right">
        <div>
          <p className="font-display text-[1.75rem] leading-none">
            {formatPrice(pack.priceTnd, pack.pricePrefix)}
          </p>
          <p className="mt-2 text-sm text-stone">{formatDuration(pack.durationMin)}</p>
        </div>
        <PackButton packId={pack.id} className="link-line">
          Choisir
        </PackButton>
      </div>
    </li>
  );
}

export function Packs() {
  return (
    <section id="formules" className="py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          index="01"
          eyebrow="Les formules"
          title={
            <>
              Une préparation <span className="display-italic">à la mesure</span> de
              l&apos;événement.
            </>
          }
          intro="Chaque formule réunit les soins qu'il faut, dans l'ordre qu'il faut. Vous choisissez l'occasion, nous composons le reste avec vous."
        />
        <ul className="mt-14 border-t border-line lg:mt-20">
          {site.packs.map((pack) => (
            <PackRow key={pack.id} pack={pack} />
          ))}
        </ul>
      </div>
    </section>
  );
}
