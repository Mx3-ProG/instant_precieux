// Offres de photographie — placeholders prêts pour Stripe.
// `stripePriceId` sera renseigné une fois les produits créés côté Stripe.

export interface ServiceOffer {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // en euros
  currency: string;
  duration: string;
  deliverables: string[];
  stripePriceId: string | null;
  featured?: boolean;
}

export const serviceOffers: ServiceOffer[] = [
  {
    id: "portrait-essentiel",
    name: "Portrait Essentiel",
    tagline: "Une séance courte, une image juste.",
    description:
      "Séance portrait en lumière naturelle, en studio ou en extérieur. Idéale pour un besoin professionnel ou personnel.",
    price: 190,
    currency: "EUR",
    duration: "1 heure",
    deliverables: [
      "1 heure de prise de vue",
      "10 photos retouchées",
      "Galerie privée en ligne",
      "Livraison sous 7 jours",
    ],
    stripePriceId: null,
  },
  {
    id: "editorial",
    name: "Séance Éditoriale",
    tagline: "Une narration visuelle complète.",
    description:
      "Direction artistique, repérage et prise de vue sur une demi-journée. Pensée pour les marques et les projets éditoriaux.",
    price: 690,
    currency: "EUR",
    duration: "4 heures",
    deliverables: [
      "4 heures de prise de vue",
      "Direction artistique et moodboard",
      "40 photos retouchées",
      "Licence commerciale 12 mois",
      "Livraison sous 10 jours",
    ],
    stripePriceId: null,
    featured: true,
  },
  {
    id: "campagne",
    name: "Campagne & Film",
    tagline: "Photo et vidéo, un même regard.",
    description:
      "Production complète sur une journée : photographie et captation vidéo, montage inclus.",
    price: 1490,
    currency: "EUR",
    duration: "1 journée",
    deliverables: [
      "Journée complète de tournage",
      "80 photos retouchées",
      "1 film de 60 secondes monté",
      "Formats réseaux sociaux inclus",
      "Licence commerciale 24 mois",
    ],
    stripePriceId: null,
  },
];

export const getOfferById = (id?: string | null) =>
  serviceOffers.find((offer) => offer.id === id) ?? null;

export const formatPrice = (amount: number, currency = "EUR") =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
