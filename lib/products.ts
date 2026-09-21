/**
 * Catalogue EZAKI Parfum synchronise depuis la boutique officielle.
 *
 * Les champs absents de la boutique source restent explicitement renseignes
 * comme non disponibles afin de ne pas inventer de caracteristiques produit.
 */

export type ProductCategory = 'Homme' | 'Femme' | 'Mixte' | 'Non classe';

export type FragranceNotes = {
  top: string[];
  heart: string[];
  base: string[];
};

export type Product = {
  id: string;
  slug: string;
  sourceId?: string;
  sourceUrl?: string;
  name: string;
  arabic: string;
  tagline: string;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: ProductCategory;
  family: string;
  concentration: string;
  size: string;
  notes: FragranceNotes;
  image: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  longevity: string;
  intensity: string;
  inStock: boolean;
  featured: boolean;
  accent: string;
};

const unavailableDetails = {
  arabic: '',
  tagline: '',
  shortDescription: '',
  category: 'Non classe' as const,
  family: 'Non renseignee',
  concentration: 'Non renseignee',
  size: 'Non renseignee',
  notes: { top: [], heart: [], base: [] },
  rating: 0,
  reviewsCount: 0,
  longevity: 'Non renseignee',
  intensity: 'Non renseignee',
  inStock: true,
  featured: true,
  accent: '#C9A227',
};

function product(
  slug: string,
  name: string,
  price: number,
  image: string,
  description = '',
): Product {
  return {
    id: slug,
    slug,
    name,
    price,
    image,
    description,
    ...unavailableDetails,
  };
}

export const fallbackProducts: Product[] = [
  product(
    'aard-5-b',
    'عرض 5 ب',
    200,
    '/images/products/offre-5-b.png',
  ),
  product(
    'aard-4-b',
    'عرض 4 ب',
    180,
    '/images/products/offre-4-b.png',
  ),
  product(
    'aard',
    'عرض 3 ب',
    149,
    '/images/products/offre-3-b.png',
  ),
  product(
    'aard3-b',
    'عرض3 ب',
    149,
    '/images/products/offre3-b.png',
  ),
  product(
    'aard4-b',
    'عرض4 ب',
    180,
    '/images/products/offre4-b.png',
  ),
  product(
    'aard-5-b-1',
    'عرض 5 ب',
    200,
    '/images/products/offre-5-b-1.png',
  ),
  product('may-way', 'May way', 50, '/images/products/may-way.jpg'),
  product('ber-bery-her', 'Ber bery her', 50, '/images/products/ber-bery-her.jpg'),
  product('prada-paradoux', 'Prada paradoux', 50, '/images/products/prada-paradoux.jpg'),
  product('eskada-taj', 'eskada taj', 50, '/images/products/eskada-taj.jpg'),
  product('le-beau', 'Le beau', 50, '/images/products/le-beau.png', 'المنتج الخامس'),
  product('1million', '1million', 50, '/images/products/1million.png', 'المنتج الثاني'),
  product('product-4', 'Lacoste noir', 50, '/images/products/lacoste-noir.png', 'المنتج-الرابع'),
  product('product-1', 'Diore homme', 50, '/images/products/diore-homme.png', 'المنتج الأول'),
  product(
    'product-3',
    'You intensely',
    50,
    '/images/products/you-intensely.png',
    'المنتج الثالث',
  ),
];

/** No per-product collection is exposed by the official store. */
export const productCategories: ProductCategory[] = ['Non classe'];

import { syncedProducts } from './products.synced.generated';
import sourceMap from './product-source-map.generated.json';

const emptySynchronizedDetails = {
  arabic: '',
  tagline: '',
  shortDescription: '',
  category: 'Non classe' as const,
  family: 'Non renseignee',
  concentration: 'Non renseignee',
  size: 'Non renseignee',
  notes: { top: [], heart: [], base: [] },
  rating: 0,
  reviewsCount: 0,
  longevity: 'Non renseignee',
  intensity: 'Non renseignee',
  inStock: true,
  featured: true,
  accent: '#C9A227',
};

const fallbackById = new Map(fallbackProducts.map((product) => [product.id, product]));
const fallbackBySlug = new Map(fallbackProducts.map((product) => [product.slug, product]));

function createSynchronizedProduct(
  entry: (typeof syncedProducts)[string],
  localId: string,
  localSlug: string,
): Product {
  return {
    id: localId,
    slug: localSlug,
    sourceId: entry.sourceId,
    sourceUrl: entry.sourceUrl,
    name: entry.name,
    price: entry.price,
    image: entry.image,
    description: '',
    ...emptySynchronizedDetails,
  };
}

function mergeSynchronizedProducts(): Product[] {
  const merged = fallbackProducts.map((fallback) => {
    const mappedSource = Object.values(sourceMap).find(
      (value) => value.localId === fallback.id || value.localSlug === fallback.slug,
    );
    const synced =
      syncedProducts[fallback.id] ??
      (mappedSource ? syncedProducts[mappedSource.localId] : undefined);
    if (!synced) return fallback;
    return {
      ...fallback,
      sourceId: synced.sourceId,
      sourceUrl: synced.sourceUrl,
      name: synced.name,
      price: synced.price,
      image: synced.image,
    };
  });

  for (const [localId, entry] of Object.entries(syncedProducts)) {
    if (fallbackById.has(localId)) continue;
    const mapped = Object.values(sourceMap).find((value) => value.localId === localId);
    const localSlug = mapped?.localSlug ?? entry.sourceId;
    if (fallbackBySlug.has(localSlug)) continue;
    merged.push(createSynchronizedProduct(entry, localId, localSlug));
  }

  return merged;
}

/** Effective catalog: synchronized fields over the manually maintained fallback. */
export const products: Product[] = mergeSynchronizedProducts();

export const priceFrom = Math.min(...products.map((product) => product.price));
export const priceTo = Math.max(...products.map((product) => product.price));

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured).slice(0, 6);
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return products.slice(0, limit);
  return products.filter((product) => product.slug !== slug).slice(0, limit);
}
