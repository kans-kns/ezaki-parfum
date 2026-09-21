'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { ArrowRight, Trash2, Truck, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { cartOrderMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { site } from '@/lib/site';
import { useCart } from './CartProvider';
import { QuantitySelector } from './CartButton';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { productImage } from '@/lib/images';

/** Tiroir panier : recapitulatif + commande WhatsApp immediate. */
export default function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeItem, subtotal, savings, count } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeCart]);

  const whatsappHref = buildWhatsAppUrl(
    cartOrderMessage(
      items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        size: item.product.size,
        price: item.product.price,
      })),
    ),
  );

  return (
    <div
      className={cn('fixed inset-0 z-[70]', isOpen ? 'pointer-events-auto' : 'pointer-events-none')}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <button
        type="button"
        tabIndex={isOpen ? 0 : -1}
        onClick={closeCart}
        aria-label="Fermer le panier"
        className={cn(
          'absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Votre panier"
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[#e1d7c8] bg-[#f7f4ee] shadow-2xl transition-transform duration-500 ease-luxe',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b border-[#e7e0d4] px-5 py-4">
          <div>
            <p className="eyebrow">Votre commande</p>
            <h2 className="mt-1 font-display text-xl">Panier {count > 0 ? `(${count})` : ''}</h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fermer le panier"
            className="grid h-10 w-10 place-items-center rounded-full border border-[#d8cdbd] text-[#766e64] transition-colors hover:border-[#9a7634] hover:text-[#80612d]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-[#d8cdbd] text-[#9a7634]">
                <Truck className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="font-display text-lg">Votre panier est vide</p>
              <p className="max-w-xs text-sm text-[#766e64]">
                Découvrez nos parfums et commandez en quelques secondes sur WhatsApp.
              </p>
              <Link href="/parfums" onClick={closeCart} className="btn-gold mt-2">
                Voir les parfums
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.product.slug}
                  className="flex gap-4 rounded-2xl border border-[#e7e0d4] bg-white p-3 shadow-[0_14px_35px_-30px_rgba(27,26,24,0.4)]"
                >
                  <Link
                    href={`/parfums/${item.product.slug}`}
                    onClick={closeCart}
                    className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-[#e1d7c8] bg-[#f7f4ee]"
                  >
                    <Image
                      src={productImage(item.product)}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/parfums/${item.product.slug}`}
                          onClick={closeCart}
                          className="block truncate font-display text-base text-[#2e2b27] hover:text-[#80612d]"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-[#81786d]">
                          {item.product.size} • {item.product.concentration}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.slug)}
                        aria-label={`Retirer ${item.product.name} du panier`}
                        className="grid h-8 w-8 place-items-center rounded-full text-[#9a9188] transition-colors hover:text-[#80612d]"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <QuantitySelector
                        size="sm"
                        value={item.quantity}
                        onChange={(value) => setQuantity(item.product.slug, value)}
                        ariaLabel={`Quantité pour ${item.product.name}`}
                      />
                      <span className="font-display text-base text-[#80612d]">
                        {formatPrice(item.total)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 ? (
          <footer className="border-t border-[#e7e0d4] px-5 py-5">
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-[#766e64]">Sous-total</dt>
                <dd className="font-display text-lg text-[#2e2b27]">{formatPrice(subtotal)}</dd>
              </div>
              {savings > 0 ? (
                <div className="flex items-center justify-between text-[#80612d]">
                  <dt>Vous économisez</dt>
                  <dd>{formatPrice(savings)}</dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between text-[#766e64]">
                <dt>Livraison</dt>
                <dd className="text-[#80612d]">Gratuite</dd>
              </div>
            </dl>

            <p className="mt-3 flex items-center gap-2 text-xs text-[#81786d]">
              <Truck className="h-4 w-4 text-[#9a7634]" aria-hidden="true" />
              {site.freeDelivery} • Paiement à la livraison
            </p>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-4 w-full"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Commander sur WhatsApp
            </a>

            <Link href="/panier" onClick={closeCart} className="btn-outline mt-3 w-full">
              Voir le panier et finaliser
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}