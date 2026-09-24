import couple1 from "@/assets/gallery/10071542.jpg";
import couple2 from "@/assets/gallery/10071546.jpg";
import couple3 from "@/assets/gallery/10071548.jpg";
import couple4 from "@/assets/gallery/10071549.jpg";
import couple5 from "@/assets/gallery/10071553.jpg";
import couple6 from "@/assets/gallery/10071555.jpg";
import portrait1 from "@/assets/gallery/10610407.jpg";
import portrait2 from "@/assets/gallery/10610413.jpg";
import editorial1 from "@/assets/gallery/10667857.jpg";
import editorial2 from "@/assets/gallery/10667863.jpg";
import story1 from "@/assets/gallery/10669638.jpg";
import story2 from "@/assets/gallery/10675993.jpg";

export type Service = {
  id: string;
  name: string;
  price: number;
  description: string;
  photoCount: number;
  usbIncluded: boolean;
  published?: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  alt_text: string;
  published?: boolean;
};

export const services: Service[] = [
  {
    id: "mini",
    name: "Mini",
    price: 50,
    description: "Un format essentiel pour conserver quelques instants choisis.",
    photoCount: 5,
    usbIncluded: false,
    published: true,
  },
  {
    id: "souvenir",
    name: "Souvenir",
    price: 100,
    description: "Une séance complète, douce et spontanée, réalisée à domicile.",
    photoCount: 15,
    usbIncluded: false,
    published: true,
  },
  {
    id: "famille",
    name: "Famille",
    price: 150,
    description: "Davantage d'images pour raconter les liens et les gestes qui vous ressemblent.",
    photoCount: 25,
    usbIncluded: true,
    published: true,
  },
];

export const categories = [
  { id: "grossesse", name: "Femme enceinte", description: "Une séance douce pour immortaliser cette belle attente." },
  { id: "naissance", name: "Bébé & naissance", description: "Les premiers sourires, les petits détails et les premiers jours." },
  { id: "famille", name: "Photo familiale", description: "Des souvenirs simples et chaleureux à partager en famille." },
  { id: "animaux", name: "Animaux", description: "Votre compagnon fait partie de la famille : gardons ses souvenirs." },
  { id: "anniversaire", name: "Anniversaire", description: "Les moments forts de votre journée, capturés naturellement." },
  { id: "sur-mesure", name: "Sur mesure", description: "Un projet particulier ? Échangeons pour créer une séance qui vous ressemble." },
];

export const gallery: GalleryItem[] = [
  { id: "g1", title: "À deux", category: "Couple", description: "Un soir en ville, sans mise en scène.", image_url: couple1, alt_text: "Portrait intime d'un couple en noir et blanc", published: true },
  { id: "g2", title: "Le mouvement", category: "Couple", description: "Une promenade saisie sur le vif.", image_url: couple2, alt_text: "Couple se promenant à vélo", published: true },
  { id: "g3", title: "Complices", category: "Couple", description: "Des gestes ordinaires qui deviennent précieux.", image_url: couple3, alt_text: "Couple complice dans un café", published: true },
  { id: "g4", title: "Lumières du soir", category: "Couple", description: "Une histoire dans la lumière de la ville.", image_url: couple4, alt_text: "Couple souriant sous les lumières du soir", published: true },
  { id: "g5", title: "Présence", category: "Portrait", description: "Un portrait sensible et intemporel.", image_url: portrait1, alt_text: "Portrait éditorial dans un intérieur", published: true },
  { id: "g6", title: "Douceur", category: "Portrait", description: "La lumière naturelle comme seul décor.", image_url: portrait2, alt_text: "Portrait féminin en lumière naturelle", published: true },
  { id: "g7", title: "Élan", category: "Famille", description: "Les liens, les rires, le mouvement.", image_url: editorial1, alt_text: "Groupe dans un paysage naturel", published: true },
  { id: "g8", title: "Ensemble", category: "Famille", description: "Une image vivante, pleine de personnalité.", image_url: editorial2, alt_text: "Deux personnes marchant dans un champ", published: true },
  { id: "g9", title: "Histoire I", category: "Grossesse", description: "Des images calmes pour un moment singulier.", image_url: story1, alt_text: "Portrait doux en intérieur", published: true },
  { id: "g10", title: "Histoire II", category: "Grossesse", description: "Une trace sensible de ce qui change.", image_url: story2, alt_text: "Portrait poétique dans un champ", published: true },
  { id: "g11", title: "Regards", category: "Couple", description: "Ce qui se passe entre les mots.", image_url: couple5, alt_text: "Portrait rapproché d'un couple", published: true },
  { id: "g12", title: "Retrouvailles", category: "Couple", description: "Une parenthèse rien qu'à vous.", image_url: couple6, alt_text: "Couple se retrouvant dans la ville", published: true },
];
