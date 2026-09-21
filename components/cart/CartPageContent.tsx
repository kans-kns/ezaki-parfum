'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { site } from '@/lib/site';
import { buildWhatsAppUrl, cartOrderMessage } from '@/lib/whatsapp';
import { useCart } from './CartProvider';
import { QuantitySelector } from './CartButton';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import Reveal from '@/components/ui/Reveal';
import { productImage } from '@/lib/images';

/** Page panier complete : modification, recapitulatif et envoi WhatsApp. */
export default function CartPageContent() {
  const { items, subtotal, savings, count, setQuantity, removeItem, clearCart, isEmpty } = useCart();
  const [customer, setCustomer] = useState({ fullName: '', city: '', phone: '', note: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof typeof customer, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleOrder = () => {
    const next: Record<string, string> = {};
    if (customer.fullName.trim().length < 3) next.fullName = 'Merci d\u2019indiquer votre nom.';
    if (customer.city.trim().length < 2) next.city = 'Merci d\u2019indiquer votre ville.';
    if (!/^[0-9+\s]{9,15}$/.test(customer.phone.trim())) {
      next.phone = 'Numéro de téléphone invalide.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const href = buildWhatsAppUrl(
      cartOrderMessage(
        items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          size: item.product.size,
          price: item.product.price,
        })),
        {
          fullName: customer.fullName.trim(),
          city: customer.city.trim(),
          phone: customer.phone.trim(),
          note: customer.note.trim() || undefined,
        },
      ),
    );

    window.open(href, '_blank', 'noopener,noreferrer');
  };

  if (isEmpty) {
    return (
      <Reveal className="flex flex-col items-center gap-5 rounded-[2rem] border border-[#e7e0d4] bg-white px-6 py-16 text-center shadow-[0_18px_45px_-38px_rgba(27,26,24,0.45)]">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-[#d8cdbd] text-[#9a7634]">
          <ShoppingBag className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="font-display text-2xl">Votre panier est vide</h2>
        <p className="max-w-md text-sm text-[#766e64]">
          Ajoutez un parfum depuis la collection, ou commandez directement sur WhatsApp : nous vous
          conseillons selon vos goûts.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/parfums" className="btn-gold px-6 py-3">
            Découvrir nos parfums
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={buildWhatsAppUrl(
              `Bonjour ${site.name}, je souhaite un conseil pour choisir un parfum.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline px-6 py-3"
          >
            <WhatsAppIcon className="h-5 w-5 text-gold" />
            Demander un conseil
          </a>
        </div>
      </Reveal>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start lg:gap-10">
      <Reveal className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl">
            {count} article{count > 1 ? 's' : ''} dans votre panier
          </h2>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs uppercase tracking-[0.18em] text-[#9a9188] transition-colors hover:text-[#80612d]"
          >
            Vider le panier
          </button>
        </div>
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li
              key={item.product.slug}
              className="flex gap-4 rounded-3xl border border-[#e7e0d4] bg-white p-4 shadow-[0_14px_35px_-30px_rgba(27,26,24,0.4)]"
            >
              <Link
                href={`/parfums/${item.product.slug}`}
                className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#e1d7c8] bg-[#f7f4ee] sm:h-32 sm:w-28"
              >
                <Image
                  src={productImage(item.product)}
                  alt={item.product.name}
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/parfums/${item.product.slug}`}
                      className="block font-display text-lg text-[#2e2b27] hover:text-[#80612d]"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-[#81786d]">
                      {item.product.family} • {item.product.size} • {item.product.concentration}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.slug)}
                    aria-label={`Retirer ${item.product.name}`}
                    className="grid h-9 w-9 place-items-center rounded-full text-[#9a9188] transition-colors hover:text-[#80612d]"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(value) => setQuantity(item.product.slug, value)}
                    ariaLabel={`Quantité pour ${item.product.name}`}
                  />
                  <div className="text-right">
                    <p className="font-display text-xl text-[#80612d]">{formatPrice(item.total)}</p>
                    <p className="text-[0.7rem] text-[#9a9188]">
                      soit {formatPrice(item.product.price)} l&apos;unité
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={120} className="flex flex-col gap-5 rounded-3xl border border-[#e1d7c8] bg-white p-5 shadow-[0_18px_45px_-38px_rgba(27,26,24,0.45)] sm:p-6 lg:sticky lg:top-28">
        <h2 className="font-display text-xl">Récapitulatif</h2>

        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-[#766e64]">Sous-total</dt>
            <dd className="font-display text-lg text-[#2e2b27]">{formatPrice(subtotal)}</dd>
          </div>
          {savings > 0 ? (
            <div className="flex items-center justify-between text-[#80612d]">
              <dt>Remise appliquée</dt>
              <dd>- {formatPrice(savings)}</dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between">
            <dt className="text-[#766e64]">Livraison</dt>
            <dd className="text-[#80612d]">Gratuite</dd>
          </div>
          <div className="flex items-center justify-between border-t border-[#e7e0d4] pt-3">
            <dt className="font-display text-base text-[#2e2b27]">Total à payer</dt>
            <dd className="font-display text-2xl text-[#80612d]">{formatPrice(subtotal)}</dd>
          </div>
        </dl>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-[#766e64]">Nom complet *</span>
            <input
              type="text"
              autoComplete="name"
              value={customer.fullName}
              onChange={(event) => update('fullName', event.target.value)}
              placeholder="Ex : Salma Bennani"
              aria-invalid={Boolean(errors.fullName)}
              className="w-full rounded-2xl border border-[#e1d7c8] bg-[#f7f4ee] px-4 py-3 text-sm text-[#3b3732] transition-colors placeholder:text-[#9a9188] focus:border-[#9a7634] focus:outline-none"
            />
            {errors.fullName ? (
              <span className="text-xs text-gold-light">{errors.fullName}</span>
            ) : null}
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-[#766e64]">Téléphone *</span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={customer.phone}
                onChange={(event) => update('phone', event.target.value)}
                placeholder="0654117023"
                aria-invalid={Boolean(errors.phone)}
                className="w-full rounded-2xl border border-[#e1d7c8] bg-[#f7f4ee] px-4 py-3 text-sm text-[#3b3732] transition-colors placeholder:text-[#9a9188] focus:border-[#9a7634] focus:outline-none"
              />
              {errors.phone ? (
                <span className="text-xs text-gold-light">{errors.phone}</span>
              ) : null}
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="text-[#766e64]">Ville *</span>
              <input
                type="text"
                autoComplete="address-level2"
                value={customer.city}
                onChange={(event) => update('city', event.target.value)}
                placeholder="Casablanca"
                aria-invalid={Boolean(errors.city)}
                className="w-full rounded-2xl border border-[#e1d7c8] bg-[#f7f4ee] px-4 py-3 text-sm text-[#3b3732] transition-colors placeholder:text-[#9a9188] focus:border-[#9a7634] focus:outline-none"
              />
              {errors.city ? <span className="text-xs text-gold-light">{errors.city}</span> : null}
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm">
            <span className="text-[#766e64]">Adresse ou remarque (optionnel)</span>
            <textarea
              rows={3}
              value={customer.note}
              onChange={(event) => update('note', event.target.value)}
              placeholder="Quartier, rue, immeuble, horaire de livraison…"
              className="w-full resize-none rounded-2xl border border-[#e1d7c8] bg-[#f7f4ee] px-4 py-3 text-sm text-[#3b3732] transition-colors placeholder:text-[#9a9188] focus:border-[#9a7634] focus:outline-none"
            />
          </label>
        </div>

        <button type="button" onClick={handleOrder} className="btn-gold w-full px-6 py-3.5">
          <WhatsAppIcon className="h-5 w-5" />
          Envoyer la commande sur WhatsApp
        </button>

        <p className="text-xs leading-relaxed text-[#9a9188]">
          Paiement à la livraison, en espèces. Aucune donnée bancaire n&apos;est demandée sur ce
          site : votre commande est confirmée par {site.name} sur WhatsApp au {site.phone}.
        </p>

        <Link href="/parfums" className="btn-outline w-full px-6 py-3">
          Continuer mes achats
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </div>
  );
}