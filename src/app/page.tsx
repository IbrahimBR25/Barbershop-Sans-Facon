import { site } from "@/config/site";
import { Booking } from "@/components/site/Booking";
import { Cortege } from "@/components/site/Cortege";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { Gallery } from "@/components/site/Gallery";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Infos } from "@/components/site/Infos";
import { MobileBar } from "@/components/site/MobileBar";
import { Packs } from "@/components/site/Packs";
import { PendingBanner } from "@/components/site/PendingBanner";
import { Services } from "@/components/site/Services";

/** Données structurées pour Google (fiche d'établissement). */
function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.contact.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.addressLines[0],
      addressLocality: site.contact.city,
      addressCountry: "TN",
    },
    sameAs: Object.values(site.socials).filter(Boolean),
  };
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <PendingBanner />
      <main className="flex-1">
        <Hero />
        <Packs />
        <Cortege />
        <Gallery />
        <Services />
        <Booking />
        <Infos />
        <Faq />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
