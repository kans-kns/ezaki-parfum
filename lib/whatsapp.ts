import type { Product } from './products';
import { formatPrice } from './format';
import { site } from './site';

/** Construit un lien WhatsApp avec un message pre-rempli. */
export function buildWhatsAppUrl(message?: string): string {
  if (!message) return site.whatsappBase;
  return `${site.whatsappBase}?text=${encodeURIComponent(message)}`;
}

/** Message generique (boutons "Commander", "Commander sur WhatsApp"). */
export const generalOrderMessage =
  `Bonjour ${site.name}, je souhaite commander un parfum. Pouvez-vous me conseiller ?`;

/** Message pour un produit precis : "Bonjour EZAKI Parfum, je souhaite commander le parfum EZAKI Noir à 179 DH." */
export function productOrderMessage(
  product: Pick<Product, 'name' | 'price' | 'size'>,
  quantity = 1,
): string {
  const base = `Bonjour ${site.name}, je souhaite commander le parfum ${product.name} à ${formatPrice(
    product.price,
  )}.`;
  const details = quantity > 1
    ? ` Quantité : ${quantity} — Taille : ${product.size} — Total : ${formatPrice(
        product.price * quantity,
      )}.`
    : ` Taille : ${product.size}.`;
  return `${base}${details} ${site.freeDelivery}.`;
}

/** Message detaille pour toute la commande du panier. */
export function cartOrderMessage(
  lines: { name: string; quantity: number; size?: string; price: number }[],
  customer?: { fullName?: string; city?: string; phone?: string; note?: string },
): string {
  const items = lines
    .map(
      (line) =>
        `• ${line.quantity} x ${line.name}${line.size ? ` (${line.size})` : ''} — ${formatPrice(
          line.price * line.quantity,
        )}`,
    )
    .join('\n');

  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  const customerBlock = [
    customer?.fullName ? `Nom : ${customer.fullName}` : null,
    customer?.city ? `Ville : ${customer.city}` : null,
    customer?.phone ? `Téléphone : ${customer.phone}` : null,
    customer?.note ? `Remarque : ${customer.note}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return [
    `Bonjour ${site.name}, je souhaite commander :`,
    items,
    `Total : ${formatPrice(total)} — ${site.freeDelivery}.`,
    customerBlock,
  ]
    .filter(Boolean)
    .join('\n');
}

/** Message venant du formulaire de commande de la page Contact. */
export function formOrderMessage(values: {
  fullName: string;
  phone: string;
  city: string;
  product: string;
  quantity: number;
  note?: string;
}): string {
  return [
    `Bonjour ${site.name}, je souhaite passer commande.`,
    `Parfum : ${values.product}`,
    `Quantité : ${values.quantity}`,
    `Nom : ${values.fullName}`,
    `Téléphone : ${values.phone}`,
    `Ville : ${values.city}`,
    values.note ? `Remarque : ${values.note}` : null,
    site.freeDelivery,
  ]
    .filter(Boolean)
    .join('\n');
}
