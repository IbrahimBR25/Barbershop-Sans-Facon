/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SANS FAÇON — configuration du site
 *
 *  Tout ce qui est susceptible de changer (téléphone, adresse, prix,
 *  réseaux sociaux, formules, horaires, photos) se modifie ICI, nulle part
 *  ailleurs. Les valeurs marquées « À COMPLÉTER » sont des valeurs
 *  provisoires.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type Pack = {
  id: string;
  numeral: string;
  name: string;
  tagline: string;
  description: string;
  includes: string[];
  /** Durée approximative en minutes (sert aussi à l'agenda). */
  durationMin: number;
  durationLabel: string;
  /** Prix en dinars. `null` = affiche « Tarif sur demande ». */
  priceTnd: number | null;
  /** Préfixe optionnel, ex. « à partir de ». */
  pricePrefix?: string;
  featured?: boolean;
};

export type Service = {
  name: string;
  detail?: string;
  /** Prix en dinars. `null` = affiche « — ». */
  priceTnd: number | null;
};

export type GalleryItem = {
  /** Chemin dans /public, ex. « /photos/salon-1.jpg ». */
  src: string;
  alt: string;
};

export const site = {
  name: "Sans Façon",
  baseline: "Barbier & soins pour homme",
  description:
    "Sans Façon, barbier haut de gamme : coupe, rasage traditionnel, soins du visage et préparation complète avant un mariage, une fête ou un grand événement.",
  /** URL publique du site (sans « / » final). Définie par NEXT_PUBLIC_SITE_URL en production. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "fr-TN",
  timezone: "Africa/Tunis",

  contact: {
    /** À COMPLÉTER — numéro affiché sur le site. */
    phoneDisplay: "+216 00 000 000",
    /** À COMPLÉTER — même numéro, format international sans espaces. */
    phoneE164: "+21600000000",
    /** À COMPLÉTER — numéro WhatsApp qui reçoit les demandes (format international). */
    whatsappE164: "+21600000000",
    /** À COMPLÉTER */
    addressLines: ["Adresse à venir", "Tunis, Tunisie"],
    city: "Tunis",
    /** À COMPLÉTER — lien Google Maps du salon (laisser vide pour masquer le bouton). */
    mapsUrl: "https://maps.google.com/",
  },

  /** Horaires affichés sur le site. */
  hours: [
    { days: "Lundi — Samedi", hours: "09:00 — 20:00" },
    { days: "Dimanche", hours: "Fermé" },
  ],

  /** Règles du formulaire de réservation. */
  booking: {
    /** Premier et dernier créneau proposés (heure de début). */
    firstSlot: "09:00",
    lastSlot: "19:00",
    /** Écart entre deux créneaux proposés, en minutes. */
    stepMin: 60,
    /** Jours fermés : 0 = dimanche, 1 = lundi … 6 = samedi. */
    closedWeekdays: [0] as number[],
    /** Nombre de jours affichés en raccourci dans le formulaire. */
    quickDays: 10,
    /** Réservation possible jusqu'à N jours à l'avance. */
    maxDaysAhead: 120,
  },

  /** À COMPLÉTER — laisser une chaîne vide pour masquer un réseau. */
  socials: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/",
  },

  packs: [
    {
      id: "marie",
      numeral: "I",
      name: "Le Marié",
      tagline: "La préparation complète avant le grand jour",
      description:
        "Un accompagnement sur mesure dans les jours qui précèdent votre mariage, pour arriver au sommet le jour J.",
      includes: [
        "Consultation et coupe sur mesure",
        "Rasage traditionnel ou taille de barbe",
        "Soin complet du visage et masque",
        "Épilation au fil, sourcils et contours",
        "Retouche le matin du mariage",
      ],
      durationMin: 150,
      durationLabel: "2 h 30 · en une ou plusieurs séances",
      priceTnd: null, // À COMPLÉTER
      pricePrefix: "à partir de",
      featured: true,
    },
    {
      id: "evenement",
      numeral: "II",
      name: "L'Événement",
      tagline: "Fête, fiançailles, soirée, Aïd",
      description:
        "Tout ce qu'il faut pour être impeccable le soir même : net, frais, soigné.",
      includes: [
        "Coupe et coiffage",
        "Rasage ou taille de barbe",
        "Soin express du visage",
        "Finitions et parfum",
      ],
      durationMin: 90,
      durationLabel: "1 h 30",
      priceTnd: null, // À COMPLÉTER
    },
    {
      id: "signature",
      numeral: "III",
      name: "Le Rituel Signature",
      tagline: "Le grand soin de la maison",
      description:
        "Notre rituel complet, pour le plaisir de prendre soin de soi sans raison particulière.",
      includes: [
        "Coupe",
        "Rasage à la serviette chaude",
        "Gommage, masque et massage du visage",
        "Soin du cuir chevelu",
      ],
      durationMin: 120,
      durationLabel: "2 h",
      priceTnd: null, // À COMPLÉTER
    },
    {
      id: "essentiel",
      numeral: "IV",
      name: "L'Essentiel",
      tagline: "Coupe & barbe",
      description: "L'entretien régulier, exécuté avec le même soin du détail.",
      includes: ["Coupe", "Taille de barbe ou rasage", "Finitions"],
      durationMin: 60,
      durationLabel: "1 h",
      priceTnd: null, // À COMPLÉTER
    },
  ] as Pack[],

  /** Carte des soins à l'unité. À COMPLÉTER (prix). */
  services: [
    { name: "Coupe", detail: "Ciseaux ou tondeuse, coiffage", priceTnd: null },
    { name: "Rasage traditionnel", detail: "Serviette chaude, coupe-chou", priceTnd: null },
    { name: "Taille de barbe", detail: "Dessin, contours, huile", priceTnd: null },
    { name: "Soin du visage", detail: "Nettoyage, gommage, masque", priceTnd: null },
    { name: "Masque purifiant", detail: "Charbon ou argile", priceTnd: null },
    { name: "Épilation au fil", detail: "Sourcils, pommettes", priceTnd: null },
    { name: "Soin du cuir chevelu", detail: "Shampoing, massage", priceTnd: null },
    { name: "Coloration barbe ou cheveux", priceTnd: null },
  ] as Service[],

  /**
   * Galerie. Tant que `items` est vide, le site affiche des cadres
   * décoratifs si `showPlaceholders` vaut true, sinon la section est masquée.
   * Pour ajouter des photos : déposer les fichiers dans /public/photos puis
   * les lister ici.
   */
  gallery: {
    showPlaceholders: true,
    items: [] as GalleryItem[],
  },

  /**
   * Image ou vidéo de fond de la première section (optionnel).
   * Ex. : { image: "/photos/hero.jpg", video: "/videos/hero.mp4" }
   */
  hero: {
    image: "" as string,
    video: "" as string,
  },

  faq: [
    {
      q: "Mon créneau est-il réservé dès que j'envoie le formulaire ?",
      a: "Pas encore. Le formulaire nous transmet votre souhait. Nous vous appelons ensuite pour fixer l'heure ensemble : c'est cet appel qui confirme le rendez-vous.",
    },
    {
      q: "Combien de temps à l'avance faut-il réserver pour un mariage ?",
      a: "Idéalement deux à trois semaines avant, pour organiser les séances de préparation et la retouche du jour J. En haute saison, le plus tôt est le mieux.",
    },
    {
      q: "Je n'ai pas WhatsApp, comment faire ?",
      a: "Envoyez simplement le formulaire : votre demande nous parvient quand même et nous vous rappelons. Vous pouvez aussi nous appeler directement.",
    },
    {
      q: "Puis-je modifier ou annuler mon rendez-vous ?",
      a: "Oui, un simple appel ou message suffit. Merci de nous prévenir au moins 24 h à l'avance.",
    },
    {
      q: "Proposez-vous des formules pour le marié et ses proches ?",
      a: "Oui. Précisez-le dans votre demande et nous préparons une proposition pour le groupe.",
    },
  ],
} as const satisfies Record<string, unknown>;

export function getPack(id: string | null | undefined): Pack | undefined {
  if (!id) return undefined;
  return site.packs.find((p) => p.id === id);
}

export function formatPrice(priceTnd: number | null, prefix?: string): string {
  if (priceTnd === null) return "Tarif sur demande";
  const amount = new Intl.NumberFormat("fr-TN", { maximumFractionDigits: 0 }).format(priceTnd);
  return `${prefix ? `${prefix} ` : ""}${amount} DT`;
}
