import { site } from "@/config/site";
import { BookingForm } from "@/components/site/BookingForm";

const steps = [
  ["Vous envoyez votre demande", "Le jour et l'heure qui vous arrangent. Trente secondes."],
  ["Vous la transmettez sur WhatsApp", "Le message est déjà écrit. Un appui sur « Envoyer »."],
  ["Nous vous appelons", "Nous fixons l'heure ensemble. C'est cet appel qui confirme."],
];

export function Booking() {
  return (
    <section id="reserver" className="border-t border-line-soft bg-coal py-24 sm:py-32">
      <div className="container-x">
        <div className="flex items-baseline gap-5 border-t border-line pt-5">
          <span className="index">04</span>
          <span className="eyebrow">Réservation</span>
        </div>

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-5xl sm:text-6xl lg:text-[4.75rem]">
              Demandez <span className="display-italic">votre créneau.</span>
            </h2>

            <ol className="mt-12 border-t border-line">
              {steps.map(([title, text], i) => (
                <li key={title} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-5">
                  <span className="index pt-1">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-ivory">{title}</p>
                    <p className="mt-1 text-sm text-sand">{text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-8 border-l border-gold pl-4 text-[0.9375rem] text-ivory">
              Votre créneau n&apos;est réservé qu&apos;après notre appel de confirmation.
            </p>

            <div className="mt-12">
              <p className="eyebrow">Vous préférez appeler ?</p>
              <a
                href={`tel:${site.contact.phoneE164}`}
                className="mt-3 inline-block font-display text-[2.2rem] leading-none transition-colors hover:text-gold-soft"
              >
                {site.contact.phoneDisplay}
              </a>
            </div>
          </div>

          <BookingForm />
        </div>
      </div>
    </section>
  );
}
