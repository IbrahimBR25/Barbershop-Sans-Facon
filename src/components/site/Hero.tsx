import Link from "next/link";
import { site } from "@/config/site";
import { Monogram } from "@/components/ui/icons";

export function Hero() {
  const { image, video } = site.hero;
  return (
    <section className="relative isolate overflow-hidden">
      {/* Fond : vidéo ou photo si elles sont renseignées dans la config, sinon halo doré. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {video ? (
          <video
            className="h-full w-full object-cover opacity-40"
            src={video}
            poster={image || undefined}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="h-full w-full object-cover opacity-40" src={image} alt="" />
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(70rem_36rem_at_50%_-6rem,#c9a96a26,transparent_68%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,var(--color-ink))]" />
      </div>

      {/* Cadre fin */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 -z-10 border border-line-soft sm:inset-6"
      />

      <div className="container-x flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center py-20 text-center sm:min-h-[calc(100svh-5rem)] sm:py-28">
        <Monogram className="reveal mb-8" />
        <p className="eyebrow reveal [animation-delay:120ms]">
          {site.baseline} · {site.contact.city}
        </p>

        <h1 className="reveal mt-7 max-w-4xl text-[2.9rem] font-light leading-[1.02] [animation-delay:240ms] sm:text-7xl lg:text-[5.6rem]">
          Le soin du détail,
          <br />
          <span className="display-italic">avant le grand jour.</span>
        </h1>

        <p className="reveal mx-auto mt-8 max-w-xl text-base text-sand [animation-delay:380ms] sm:text-lg">
          Mariage, fiançailles, fête ou soirée : coupe, rasage traditionnel, soins du visage.
          Vous vous installez, nous nous occupons de tout.
        </p>

        <div className="reveal mt-11 flex w-full flex-col items-center justify-center gap-4 [animation-delay:520ms] sm:w-auto sm:flex-row">
          <Link href="#reserver" className="btn btn-gold w-full sm:w-auto">
            Réserver un créneau
          </Link>
          <Link href="#formules" className="btn btn-ghost w-full sm:w-auto">
            Découvrir les formules
          </Link>
        </div>

        <p className="reveal mt-9 text-[0.8125rem] text-stone [animation-delay:640ms]">
          Réservation en 30 secondes · Confirmation par téléphone
        </p>
      </div>
    </section>
  );
}
