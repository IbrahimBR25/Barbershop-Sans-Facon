import Link from "next/link";
import { site } from "@/config/site";

export function Hero() {
  const { image, video } = site.hero;
  return (
    <section className="relative">
      <div className="container-x grid min-h-[calc(100svh-4rem)] gap-12 pb-12 pt-14 sm:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1.25fr_1fr] lg:gap-20 lg:pb-16 lg:pt-20">
        <div className="flex flex-col justify-between gap-14">
          <p className="eyebrow reveal">
            {site.baseline} — {site.contact.city}
          </p>

          <div>
            <h1 className="reveal text-[3.6rem] leading-[0.92] [animation-delay:120ms] sm:text-[6rem] lg:text-[7.6rem]">
              L&apos;art de
              <br />
              <span className="display-italic">se préparer.</span>
            </h1>
            <p className="reveal mt-9 max-w-md text-[1.0625rem] text-sand [animation-delay:260ms]">
              Coupe, rasage à la serviette chaude, soins du visage. Avant un mariage, une fête ou
              un grand rendez-vous, vous vous installez. Nous nous occupons du reste.
            </p>
            <div className="reveal mt-11 flex flex-col gap-3 [animation-delay:400ms] sm:flex-row sm:items-center sm:gap-8">
              <Link href="#reserver" className="btn btn-gold">
                Réserver un créneau
              </Link>
              {site.cortege.enabled && (
                <Link href="#cortege" className="link-line self-center sm:self-auto">
                  {site.cortege.title} — réservation de groupe
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Visuel : vidéo ou photo si renseignées dans la config, sinon cadre sobre. */}
        <div className="reveal relative min-h-[22rem] overflow-hidden border border-line-soft bg-panel [animation-delay:200ms] lg:min-h-0">
          {video ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={video}
              poster={image || undefined}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="absolute inset-0 h-full w-full object-cover" src={image} alt="" />
          ) : (
            <div aria-hidden className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[9rem] italic leading-none text-ivory/[0.07] sm:text-[12rem]">
                SF
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-line-soft bg-ink/40 px-5 py-4 backdrop-blur-sm">
            <span className="eyebrow">Le salon</span>
            <span className="eyebrow text-stone">{video || image ? site.contact.city : "Image à venir"}</span>
          </div>
        </div>
      </div>

      <div className="border-y border-line-soft">
        <ul className="container-x grid grid-cols-1 divide-y divide-line-soft text-sm text-sand sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ["Sur rendez-vous", "Une heure qui vous est réservée"],
            ["Confirmation par téléphone", "Nous vous rappelons pour fixer l'heure"],
            [site.cortege.title, "Le marié et ses proches, ensemble"],
          ].map(([title, text]) => (
            <li key={title} className="py-5 sm:px-6 sm:first:pl-0">
              <span className="block text-ivory">{title}</span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
