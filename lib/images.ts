/**
 * Resolution des visuels : photos reelles si presentes, sinon visuels
 * vectoriels generes.
 * ---------------------------------------------------------------------------
 * Le manifeste `lib/photos.generated.ts` est produit automatiquement par
 * `npm run photos` (ou `npm run dev` / `npm run build`) en scannant :
 *   - public/images/photos/     -> hero.jpg, packaging.jpg, lifestyle.jpg,
 *                                  instagram-1.jpg ... instagram-6.jpg,
 *                                  about.jpg et <slug>.jpg (parfums)
 *   - public/images/products/   -> <slug>.jpg (photo du flacon, prioritaire)
 * Voir public/images/photos/LISEZ-MOI.txt pour le mode d'emploi.
 */
import { photoManifest } from './photos.generated';
import type { Product } from './products';

/** Slug -> photo reelle, ou chemin du visuel vectoriel par defaut. */
export function productImage(product: Pick<Product, 'slug' | 'image'>): string {
  return photoManifest[`product.${product.slug}`] ?? product.image;
}

/** Visuels editoriaux : hero, packaging, lifestyle, about, instagram-N. */
export function brandImage(key: string, fallback: string): string {
  return photoManifest[key] ?? fallback;
}

/** Grille Instagram : photo dediee si presente, sinon visuel produit. */
export function instagramImage(index: number, fallback: string): string {
  return photoManifest[`instagram-${index + 1}`] ?? fallback;
}

/** Nombre de photos reelles detectees (utile pour les messages d'aide). */
export function photoCount(): number {
  return Object.keys(photoManifest).length;
}