import { SectionHeading } from "@/components/site/SectionHeading";

const steps = [
  {
    n: "1",
    title: "Vous remplissez le formulaire",
    text: "Votre nom, votre numéro, le jour et l'heure qui vous arrangent. Trente secondes.",
  },
  {
    n: "2",
    title: "Vous l'envoyez sur WhatsApp",
    text: "Le message est déjà écrit pour vous. Un appui sur « Envoyer » et nous le recevons.",
  },
  {
    n: "3",
    title: "Nous vous appelons",
    text: "Nous fixons l'heure ensemble au téléphone. C'est cet appel qui confirme votre rendez-vous.",
  },
];

export function Process() {
  return (
    <section id="comment" className="py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Comment réserver"
          title={
            <>
              Trois étapes, <span className="display-italic">sans façon</span>
            </>
          }
        />

        <ol className="mt-16 grid gap-px bg-line-soft md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="bg-ink p-8 sm:p-10">
              <p className="font-display text-7xl font-light italic leading-none text-gold/75">
                {step.n}
              </p>
              <h3 className="mt-6 text-[1.7rem]">{step.title}</h3>
              <p className="mt-3 text-[0.9375rem] text-sand">{step.text}</p>
            </li>
          ))}
        </ol>

        <p className="mx-auto mt-10 max-w-2xl border border-line bg-panel px-6 py-5 text-center text-[0.9375rem] text-ivory">
          <span className="eyebrow mb-2 block">À retenir</span>
          Votre créneau n&apos;est réservé qu&apos;après notre appel de confirmation.
        </p>
      </div>
    </section>
  );
}
