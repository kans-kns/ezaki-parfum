import { site } from './site';

/** 179 -> "179 DH" */
export function formatPrice(value: number): string {
  return `${value} ${site.currency}`;
}

/** Prix total d'une ligne de panier. */
export function lineTotal(price: number, quantity: number): number {
  return price * quantity;
}

/** Pourcentage de remise entre l'ancien prix et le nouveau prix. */
export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** "179 DH" -> "179 DH" + ancien prix barre. */
export function formatPriceRange(price: number, oldPrice?: number): string {
  return oldPrice && oldPrice > price
    ? `${formatPrice(price)} au lieu de ${formatPrice(oldPrice)}`
    : formatPrice(price);
}
