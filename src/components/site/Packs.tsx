import { formatPrice, site, type Pack } from "@/config/site";
import { PackButton } from "@/components/site/PackButton";
import { SectionHeading } from "@/components/site/SectionHeading";

function Includes({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2.5 text-[0.9375rem] text-sand">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className="mt-[0.72em] h-px w-4 shrink-0 bg-gold" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Price({ pack }: { pack: Pack }) {
  return (
    <p className="font-display text-2xl text-gold-soft">
      {formatPrice(pack.priceTnd, pack.pricePrefix)}
    </p>
  );
}

function FeaturedPack({ pack }: { pack: Pack }) {
  return (
    <article className="card relative grid gap-10 p-7 sm:p-11 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-14">
      <span className="badge badge-confirmed absolute -top-3 left-7 sm:left-11 lg:left-14">
        La formule phare
      </span>
      <div>
        <p className="font-display text-5xl italic text-gold/70">{pack.numeral}</p>
        <h3 className="mt-3 text-4xl sm:text-5xl">{pack.name}</h3>
        <p className="mt-3 text-[0.6875rem] uppercase tracking-[0.26em] text-gold">{pack.tagline}</p>
        <p className="mt-6 max-w-md text-sand">{pack.description}</p>
        <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-3">
          <Price pack={pack} />
          <p className="text-sm text-stone">{pack.durationLabel}</p>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-9 border-t border-line-soft pt-9 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
        <Includes items={pack.includes} />
        <PackButton packId={pack.id} className="btn btn-gold w-full sm:w-auto sm:self-start">
          Choisir cette formule
        </PackButton>
      </div>
    </article>
  );
}

function PackCard({ pack }: { pack: Pack }) {
  return (
    <article className="card flex flex-col p-7 sm:p-9">
      <p className="font-display text-4xl italic text-gold/70">{pack.numeral}</p>
      <h3 className="mt-3 text-3xl">{pack.name}</h3>
      <p className="mt-2.5 text-[0.6875rem] uppercase tracking-[0.24em] text-gold">{pack.tagline}</p>
      <p className="mt-5 text-[0.9375rem] text-sand">{pack.description}</p>
      <div className="my-7 h-px bg-line-soft" />
      <Includes items={pack.includes} />
      <div className="mt-auto pt-9">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <Price pack={pack} />
          <p className="text-sm text-stone">{pack.durationLabel}</p>
        </div>
        <PackButton packId={pack.id} className="btn btn-ghost mt-6 w-full">
          Choisir
        </PackButton>
      </div>
    </article>
  );
}

export function Packs() {
  const featured = site.packs.find((p) => p.featured);
  const others = site.packs.filter((p) => p !== featured);
  return (
    <section id="formules" className="py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Les formules"
          title={
            <>
              Une préparation <span className="display-italic">à la hauteur</span> de l&apos;événement
            </>
          }
          intro="Chaque formule réunit les soins qu'il faut, dans l'ordre qu'il faut. Vous choisissez l'occasion, nous composons le reste avec vous."
        />

        <div className="mt-16 space-y-6 sm:mt-20">
          {featured && <FeaturedPack pack={featured} />}
          <div className="grid gap-6 md:grid-cols-3">
            {others.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
