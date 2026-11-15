import { site } from "@/config/site";
import { PackButton } from "@/components/site/PackButton";

const example = [
  { role: "Le marié", pack: "Le Marié" },
  { role: "Témoin", pack: "Le Rituel Signature" },
  { role: "Témoin", pack: "L'Essentiel" },
  { role: "Frère", pack: "L'Événement" },
];

/** Section signature : Le Cortège, réservation de groupe. */
export function Cortege() {
  const c = site.cortege;
  if (!c.enabled) return null;
  return (
    <section id="cortege" className="theme-light py-24 sm:py-32">
      <div className="container-x">
        <div className="flex items-baseline gap-5 border-t border-line pt-5">
          <span className="index">02</span>
          <span className="eyebrow">Signature — réservation de groupe</span>
        </div>

        <div className="mt-12 grid gap-16 lg:mt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <div>
            <h2 className="text-[4.2rem] leading-[0.9] sm:text-[6.5rem] lg:text-[8rem]">{c.title}</h2>
            <p className="mt-6 font-display text-3xl italic text-sand sm:text-4xl">{c.tagline}</p>
            <p className="mt-8 max-w-md text-[1.0625rem] text-sand">{c.intro}</p>

            <ul className="mt-10 border-t border-line">
              {c.perks.map((perk, i) => (
                <li key={perk} className="flex items-baseline gap-5 border-b border-line py-4">
                  <span className="index">{String(i + 1).padStart(2, "0")}</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            {c.offer && <p className="mt-6 text-[0.9375rem] text-sand">{c.offer}</p>}
          </div>

          {/* Aperçu d'une demande de groupe */}
          <div className="self-start border border-line bg-[#efeae1] p-7 sm:p-10">
            <div className="flex items-baseline justify-between border-b border-line pb-5">
              <p className="eyebrow">Exemple de demande</p>
              <p className="eyebrow">{example.length} personnes</p>
            </div>
            <ol className="divide-y divide-line">
              {example.map((m, i) => (
                <li key={i} className="flex items-baseline justify-between gap-6 py-5">
                  <span className="flex items-baseline gap-5">
                    <span className="index">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-[1.75rem] leading-none">{m.role}</span>
                  </span>
                  <span className="text-right text-sm text-sand">{m.pack}</span>
                </li>
              ))}
            </ol>
            <div className="mt-2 flex items-baseline justify-between border-t border-line pt-5 text-sm text-sand">
              <span>Samedi, à partir de 09:00</span>
              <span>Une seule demande</span>
            </div>
            <PackButton cortege className="btn btn-gold mt-8 w-full">
              Réserver pour le cortège
            </PackButton>
          </div>
        </div>
      </div>
    </section>
  );
}
