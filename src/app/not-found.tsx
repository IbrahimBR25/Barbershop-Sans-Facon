import Link from "next/link";
import { Header } from "@/components/site/Header";

export default function NotFound() {
  return (
    <>
      <Header minimal />
      <main className="glow-top flex flex-1 items-center">
        <div className="container-x max-w-xl py-24 text-center">
          <p className="eyebrow">Page introuvable</p>
          <h1 className="mt-6 text-5xl font-light sm:text-6xl">
            Cette page <span className="display-italic">n&apos;existe pas.</span>
          </h1>
          <p className="mt-6 text-sand">
            Le lien est peut-être incomplet. Si vous cherchez votre rendez-vous, rouvrez le lien
            reçu après votre demande.
          </p>
          <Link href="/" className="btn btn-gold mt-10">
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    </>
  );
}
