import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@/config/site";
import { CopyField } from "@/components/admin/CopyField";
import { PageLoading, PageTitle } from "@/components/admin/PageLoading";
import { requireAdmin } from "@/lib/auth";
import { requireEnv } from "@/lib/env";

export const metadata: Metadata = { title: "Réglages" };

async function Settings() {
  await requireAdmin();
  const feedUrl = `${site.url}/api/agenda/${requireEnv("CALENDAR_FEED_KEY", 24)}.ics`;

  return (
    <div className="max-w-3xl space-y-6">
      <PageTitle title="Réglages" />

      <section className="card p-6 sm:p-8">
        <h2 className="text-2xl">Voir les rendez-vous dans votre agenda</h2>
        <p className="mt-3 text-[0.9375rem] text-sand">
          Abonnez votre agenda personnel à cette adresse : tous les rendez-vous confirmés y
          apparaissent automatiquement, avec le nom et le numéro du client.
        </p>
        <div className="mt-5">
          <CopyField value={feedUrl} label="Adresse du flux d'agenda" />
        </div>
        <ul className="mt-5 space-y-2.5 text-[0.9375rem] text-sand">
          <li>
            <strong className="font-normal text-ivory">Google Agenda</strong> (sur ordinateur) :
            Autres agendas → « + » → À partir de l&apos;URL → coller l&apos;adresse.
          </li>
          <li>
            <strong className="font-normal text-ivory">iPhone</strong> : Réglages → Calendrier →
            Comptes → Ajouter un compte → Autre → Ajouter un calendrier avec abonnement.
          </li>
        </ul>
        <p className="mt-5 border border-line bg-ink/60 p-4 text-sm text-sand">
          Cette adresse est privée : toute personne qui la possède peut lire vos rendez-vous. Ne
          la partagez pas. Google et Apple rafraîchissent les abonnements toutes les quelques
          heures : pour l&apos;instantané, cette page d&apos;agenda reste la référence.
        </p>
      </section>

      <section className="card p-6 sm:p-8">
        <h2 className="text-2xl">Contenu du site</h2>
        <p className="mt-3 text-[0.9375rem] text-sand">
          Prix, formules, téléphone, adresse, horaires, réseaux sociaux et photos se modifient
          dans un seul fichier du site (<span className="text-ivory">src/config/site.ts</span>).
          Demandez à votre webmaster.
        </p>
      </section>

      <section className="card p-6 sm:p-8">
        <h2 className="text-2xl">Sécurité</h2>
        <p className="mt-3 text-[0.9375rem] text-sand">
          La session reste ouverte 14 jours sur cet appareil. Sur un appareil partagé, utilisez
          « Déconnexion ». Pour changer de mot de passe ou révoquer l&apos;adresse d&apos;agenda,
          contactez votre webmaster.
        </p>
      </section>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Settings />
    </Suspense>
  );
}
