'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BadgeCheck, Droplets, Heart, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import type { Product } from '@/lib/products';
import { discountPercent, formatPrice } from '@/lib/format';
import { buildWhatsAppUrl, productOrderMessage } from '@/lib/whatsapp';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { QuantitySelector } from '@/components/cart/CartButton';
import { useCart } from '@/components/cart/CartProvider';
import { productImage } from '@/lib/images';

/** Bloc de notes olfactives (tete, coeur, fond). */
function NotesBlock({ title, notes }: { title: string; notes: string[] }) {
  return (
    <div className="rounded-2xl border border-[#e7e0d4] bg-white p-4">
      <h3 className="font-display text-base text-[#80612d]">{title}</h3>
      <ul className="mt-2 flex flex-wrap gap-2">
        {notes.map((note) => (
          <li
            key={note}
            className="rounded-full border border-[#e1d7c8] bg-[#f7f4ee] px-3 py-1 text-xs text-[#766e64]"
          >
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Fiche produit complete : galerie, notes, quantite, panier et WhatsApp. */
export default function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const discount = discountPercent(product.price, product.oldPrice);
  const whatsappHref = buildWhatsAppUrl(productOrderMessage(product, quantity));

  const handleAdd = () => {
    addItem(product.slug, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Visuel */}
      <div className="flex flex-col gap-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#e1d7c8] bg-[#f3eee5] p-2 shadow-[0_24px_60px_-42px_rgba(27,26,24,0.5)] sm:p-3">
          <Image
            src={productImage(product)}
            alt={`Flacon de parfum ${product.name} — ${product.family}`}
            fill
            sizes="(max-width: 1024px) 92vw, 46vw"
            priority
            className="rounded-[1.5rem] object-contain p-2 transition-transform duration-700 ease-luxe hover:scale-[1.02] sm:p-3"
          />
          <span className="absolute left-4 top-4 flex flex-col gap-2">
            {product.badge ? <span className="chip border-[#d8c9b2] bg-white/90 text-[#5d513f]">{product.badge}</span> : null}
            {discount ? (
              <span className="chip border-[#cdbb9d] bg-[#e9dcc5] text-[#4a3d2d]">-{discount}%</span>
            ) : null}
          </span>
          <span className="pointer-events-none absolute inset-0 rounded-[1.75rem] border border-white/70" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { icon: Truck, label: 'Livraison gratuite' },
            { icon: BadgeCheck, label: 'Paiement à la livraison' },
            { icon: Sparkles, label: product.concentration },
          ].map(({ icon: Icon, label }) => (
            <p
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[#e7e0d4] bg-white px-2 py-3 text-[0.7rem] text-[#766e64]"
            >
              <Icon className="h-4 w-4 text-[#9a7634]" aria-hidden="true" />
              {label}
            </p>
          ))}
        </div>
      </div>
      {/* Informations */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow">{product.family}</p>
            <span className="font-display text-lg text-[#9a7634]/70" dir="rtl" lang="ar">
              {product.arabic}
            </span>
          </div>
          <h1 className="font-display text-3xl leading-tight sm:text-4xl">{product.name}</h1>
          <p className="text-sm text-[#766e64]">{product.tagline}</p>
          <StarRating rating={product.rating} count={product.reviewsCount} />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <span className="font-display text-4xl text-[#80612d]">{formatPrice(product.price)}</span>
          {product.oldPrice ? (
            <span className="text-base text-[#9a9188] line-through">
              {formatPrice(product.oldPrice)}
            </span>
          ) : null}
          {discount ? (
            <span className="rounded-full bg-[#efe8dc] px-3 py-1 text-xs text-[#80612d]">
              Vous économisez {formatPrice((product.oldPrice ?? 0) - product.price)}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-relaxed text-[#5f5951]">{product.description}</p>

        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {[
            { label: 'Contenance', value: product.size },
            { label: 'Concentration', value: product.concentration },
            { label: 'Catégorie', value: product.category },
            { label: 'Tenue', value: product.longevity },
            { label: 'Sillage', value: product.intensity },
            { label: 'Famille', value: product.family },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#e7e0d4] bg-white px-3 py-2.5"
            >
              <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-[#81786d]">
                {item.label}
              </dt>
              <dd className="mt-1 text-[#3b3732]">{item.value}</dd>
            </div>
          ))}
        </dl>

        <p
          className={cn(
            'flex items-center gap-2 text-sm',
            product.inStock ? 'text-[#80612d]' : 'text-[#9a9188]',
          )}
        >
          <Droplets className="h-4 w-4" aria-hidden="true" />
          {product.inStock ? 'En stock — expédié sous 24h' : 'Rupture de stock temporaire'}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#81786d]">Quantité</span>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>
          <span className="text-sm text-[#766e64]">
            Total :{' '}
            <span className="font-display text-lg text-[#80612d]">
              {formatPrice(product.price * quantity)}
            </span>
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold min-h-14 flex-1 px-6 py-4"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Commander sur WhatsApp
          </a>
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              'btn-outline min-h-14 flex-1 border-[#cfc3b2] px-6 py-4 text-[#3b3732] hover:border-[#9a7634] hover:bg-[#f7f4ee]',
              added && 'border-[#9a7634] text-[#80612d]',
            )}
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {added ? 'Ajouté au panier' : 'Ajouter au panier'}
          </button>
        </div>

        <p className="flex items-center gap-2 text-xs text-[#81786d]">
          <Truck className="h-4 w-4 text-[#9a7634]" aria-hidden="true" />
          {site.freeDelivery} • {site.openingHours}
        </p>

        <div className="flex flex-col gap-3">
          <NotesBlock title="Notes de tête" notes={product.notes.top} />
          <NotesBlock title="Notes de cœur" notes={product.notes.heart} />
          <NotesBlock title="Notes de fond" notes={product.notes.base} />
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#e7e0d4] bg-white p-4 text-xs text-[#766e64]">
          <span className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#9a7634]" aria-hidden="true" />
            Idéal en cadeau — emballage élégant
          </span>
          <Link href="/contact" className="link-underline text-[#80612d]">
            Une question ? Écrivez-nous
          </Link>
        </div>
      </div>
    </div>
  );
}