import type { Metadata } from "next";
import { site } from "@/config/site";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

export const metadata: Metadata = {
  title: "Confidentialité",
  alternates: { canonical: "/confidentialite" },
};

const sections = [
  {
    title: "Ce que nous collectons",
    text: "Lorsque vous envoyez une demande de rendez-vous : votre nom, votre numéro de téléphone, la formule et le créneau souhaités, ainsi que la précision que vous choisissez d'ajouter.",
  },
  {
    title: "Pourquoi",
    text: "Uniquement pour vous rappeler, fixer votre rendez-vous et l'organiser. Nous n'envoyons aucune publicité et ne transmettons vos coordonnées à personne.",
  },
  {
    title: "WhatsApp",
    text: "Si vous choisissez d'envoyer votre demande par WhatsApp, le message part depuis votre propre application, sous les conditions de WhatsApp.",
  },
  {
    title: "Durée de conservation",
    text: "Les demandes sont conservées le temps nécessaire au suivi de votre rendez-vous et de la relation client. Vous pouvez demander leur suppression à tout moment. Ce site n'utilise aucun cookie publicitaire ni outil de pistage.",
  },
  {
    title: "Vos droits",
    text: "Vous pouvez à tout moment demander à consulter, corriger ou supprimer vos informations, par téléphone ou sur place.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header minimal />
      <main className="glow-top flex-1">
        <div className="container-x max-w-2xl py-16 sm:py-24">
          <p className="eyebrow">Confidentialité</p>
          <h1 className="mt-5 text-5xl font-light sm:text-6xl">
            Vos informations, <span className="display-italic">en toute discrétion</span>
          </h1>
          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-[1.7rem]">{section.title}</h2>
                <p className="mt-3 text-sand">{section.text}</p>
              </section>
            ))}
            <section>
              <h2 className="text-[1.7rem]">Nous contacter</h2>
              <p className="mt-3 text-sand">
                {site.name} · {site.contact.addressLines.join(", ")} ·{" "}
                <a href={`tel:${site.contact.phoneE164}`} className="link-gold whitespace-nowrap">
                  {site.contact.phoneDisplay}
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
