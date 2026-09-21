/**
 * Informations centrales de la marque EZAKI Parfum.
 * Un seul endroit a modifier pour mettre a jour le numero, l'Instagram ou les slogans.
 */
export const site = {
  name: 'EZAKI Parfum',
  nameUpper: 'EZAKI PARFUM',
  nameParts: { left: 'EZAKI', right: 'PARFUM' },
  tagline: 'Le parfum qui vous ressemble.',
  taglineArabic: 'عطر يليق بك',
  positioning: 'Parfums de luxe au Maroc',
  description:
    "Découvrez EZAKI Parfum, votre marque de parfums élégants au Maroc. Parfums premium, livraison gratuite partout au Maroc et commande via WhatsApp.",
  shortDescription:
    'Parfums élégants et raffinés, disponibles partout au Maroc.',
  phone: '0654117023',
  phoneIntl: '+212654117023',
  phoneHref: 'tel:+212654117023',
  whatsappNumber: '212654117023',
  whatsappBase: 'https://wa.me/212654117023',
  instagramHandle: '@ezaki_parfum',
  instagramUrl: 'https://www.instagram.com/ezaki_parfum/',
  storeUrl: 'https://ezakiparfum.youcan.store',
  currency: 'DH',
  country: 'Maroc',
  freeDelivery: 'Livraison gratuite partout au Maroc',
  qualityLine: 'La meilleure qualité au Maroc',
  openingHours: 'Service client 7j/7 — 9h à 22h',
  copyright: '© 2026 EZAKI Parfum. Tous droits réservés.',
} as const;

export const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Parfums', href: '/parfums' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Avis', href: '/#avis' },
  { label: 'Contact', href: '/contact' },
] as const;
