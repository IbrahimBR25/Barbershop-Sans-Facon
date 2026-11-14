import { site } from "@/config/site";
import { BookingForm } from "@/components/site/BookingForm";
import { PhoneIcon } from "@/components/ui/icons";

export function Booking() {
  return (
    <section id="reserver" className="glow-top border-t border-line-soft py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="min-w-0 lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow">Réservation</p>
          <h2 className="mt-5 text-4xl font-light sm:text-5xl lg:text-[3.4rem]">
            Demandez <span className="display-italic">votre créneau</span>
          </h2>
          <p className="mt-6 max-w-md text-sand">
            Indiquez le jour et l&apos;heure qui vous conviennent. Nous vous rappelons pour fixer
            le rendez-vous ensemble.
          </p>

          <ul className="mt-9 space-y-4 text-[0.9375rem] text-sand">
            {[
              "Aucun paiement en ligne",
              "Réponse par téléphone, rapidement",
              "Vous suivez l'état de votre demande sur une page dédiée",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-[0.72em] h-px w-4 shrink-0 bg-gold" />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-stone">Vous préférez appeler ?</p>
          <a
            href={`tel:${site.contact.phoneE164}`}
            className="mt-2 inline-flex items-center gap-3 font-display text-3xl text-gold-soft transition-colors hover:text-gold"
          >
            <PhoneIcon width={22} height={22} />
            {site.contact.phoneDisplay}
          </a>
        </div>

        <BookingForm />
      </div>
    </section>
  );
}
