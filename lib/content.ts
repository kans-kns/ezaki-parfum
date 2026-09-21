/**
 * Contenus editoriaux : avantages, avis clients, galerie Instagram,
 * reponses a propos et questions frequentes.
 * Modifie librement ces tableaux pour mettre a jour le site.
 */

export type Benefit = {
  icon: 'truck' | 'sparkles' | 'hand-coins' | 'headset';
  title: string;
  description: string;
};

export const benefits: Benefit[] = [
  {
    icon: 'truck',
    title: 'Livraison gratuite partout au Maroc',
    description:
      'Nous expédions dans toutes les villes et villages du Royaume, sans frais de livraison.',
  },
  {
    icon: 'sparkles',
    title: 'Qualité premium',
    description:
      'Des essences de haute qualité, une tenue longue durée et un sillage remarqué.',
  },
  {
    icon: 'hand-coins',
    title: 'Paiement à la livraison',
    description:
      'Vous payez seulement quand vous recevez votre parfum, en toute confiance.',
  },
  {
    icon: 'headset',
    title: 'Service client WhatsApp',
    description:
      'Une question, un conseil ? Nous répondons 7j/7 directement sur WhatsApp.',
  },
];

export type Review = {
  quote: string;
  author: string;
  city: string;
  rating: number;
  product?: string;
};

export const reviews: Review[] = [
  {
    quote: 'Une qualité incroyable et une livraison rapide.',
    author: 'Client EZAKI',
    city: 'Casablanca',
    rating: 5,
  },
  {
    quote: 'Le parfum sent vraiment très bon, je recommande.',
    author: 'Client EZAKI',
    city: 'Rabat',
    rating: 5,
  },
  {
    quote: 'Très belle présentation et excellent service.',
    author: 'Client EZAKI',
    city: 'Marrakech',
    rating: 5,
  },
  {
    quote: 'La tenue est vraiment longue, même après une journée de travail.',
    author: 'Client EZAKI',
    city: 'Tanger',
    rating: 5,
  },
  {
    quote: 'Commande passée sur WhatsApp, reçue en 48h. Parfait.',
    author: 'Client EZAKI',
    city: 'Agadir',
    rating: 5,
  },
  {
    quote: 'Emballage soigné, on sent le produit de luxe. Merci EZAKI.',
    author: 'Client EZAKI',
    city: 'Fès',
    rating: 5,
  },
];

export type GalleryItem = {
  /** Icone Lucide, voir components/InstagramSection.tsx */
  icon: 'bottle' | 'star' | 'gift' | 'sparkle' | 'new' | 'percent';
  label: string;
  caption: string;
  span: 'normal' | 'tall' | 'wide';
};

export const instagramGrid: GalleryItem[] = [
  {
    icon: 'bottle',
    label: 'Perfume bottles',
    caption: 'Nos flacons signatures',
    span: 'tall',
  },
  { icon: 'star', label: 'Customer reviews', caption: 'Avis clients', span: 'normal' },
  { icon: 'gift', label: 'Packaging', caption: 'Coffrets cadeaux', span: 'normal' },
  { icon: 'sparkle', label: 'Lifestyle', caption: 'L\'art de se parfumer', span: 'wide' },
  { icon: 'new', label: 'New arrivals', caption: 'Nouveautés', span: 'normal' },
  { icon: 'percent', label: 'Offers', caption: 'Offres du moment', span: 'normal' },
];

/** Statistiques affichees dans la section Instagram / confiance. */
export const brandStats = [
  { value: '22', label: 'publications' },
  { value: '1 256', label: 'followers' },
  { value: '4,9/5', label: 'note clients' },
] as const;