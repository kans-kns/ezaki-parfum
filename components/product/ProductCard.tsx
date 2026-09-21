'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, Eye, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Product } from '@/lib/products';
import { formatPrice, discountPercent } from '@/lib/format';
import { buildWhatsAppUrl, productOrderMessage } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { useCart } from '@/components/cart/CartProvider';
import { productImage } from '@/lib/images';

type ProductCardProps = {
  product: Product;
  className?: string;
  /** Priorite de chargement de l'image (premiers produits de la page). */
  priority?: boolean;
};

/**
 * Carte produit premium : fond ivoire, filet discret, zoom de l'image au survol,
 * ajout au panier et commande WhatsApp directe.
 */
export default function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const discount = useMemo(
    () => discountPercent(product.price, product.oldPrice),
    [product.price, product.oldPrice],
  );
  const whatsappHref = useMemo(
    () => buildWhatsAppUrl(productOrderMessage(product)),
    [product],
  );

  const handleAdd = () => {
    addItem(product.slug, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-[#e7e0d4] bg-white shadow-[0_18px_45px_-35px_rgba(27,26,24,0.4)] transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-[#cdbb9d] hover:shadow-[0_24px_55px_-35px_rgba(27,26,24,0.5)]',
        className,
      )}
    >
      <Link
        href={`/parfums/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-t-2xl border-b border-[#e7e0d4] bg-[#f3eee5] p-2 sm:p-3"
        aria-label={`Voir ${product.name}`}
      >
        <Image
          src={productImage(product)}
          alt={`Flacon de parfum ${product.name} — ${product.family}`}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
          priority={priority}
          className="rounded-xl object-contain p-3 transition-transform duration-700 ease-luxe group-hover:scale-[1.04] sm:p-5"
        />
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#3b3732]/10 via-transparent to-transparent"
          aria-hidden="true"
        />

        <span className="absolute left-3 top-3 flex flex-col gap-2">
          {product.badge ? <span className="chip border-[#d8c9b2] bg-white/90 text-[#5d513f]">{product.badge}</span> : null}
          {discount ? (
            <span className="chip border-[#cdbb9d] bg-[#e9dcc5] text-[#4a3d2d]">-{discount}%</span>
          ) : null}
        </span>

        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-[#d8c9b2] bg-white/90 text-[#766e64] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <Eye className="h-4 w-4" aria-hidden="true" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg text-[#2e2b27]">
              <Link href={`/parfums/${product.slug}`} className="hover:text-[#9a7634]">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#81786d]">
              {product.family}
            </p>
          </div>
          <span className="shrink-0 font-display text-sm text-[#9a7634]/70" dir="rtl" lang="ar">
            {product.arabic}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-[#766e64]">
          {product.shortDescription}
        </p>

        <StarRating rating={product.rating} count={product.reviewsCount} />

        <div className="flex items-end justify-between gap-2 pt-1">
          <p className="flex flex-col">
            <span className="font-display text-2xl text-[#80612d]">{formatPrice(product.price)}</span>
            {product.oldPrice ? (
              <span className="text-xs text-[#9a9188] line-through">
                {formatPrice(product.oldPrice)}
              </span>
            ) : null}
          </p>
          <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#81786d]">
            {product.size}
          </span>
        </div>

        <div className="mt-1 flex flex-col gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold w-full px-4 py-3 text-xs sm:text-sm"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Commander sur WhatsApp
          </a>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className={cn(
                'btn-outline flex-1 border-[#cfc3b2] px-3 py-3 text-xs text-[#3b3732] hover:border-[#9a7634] hover:bg-[#f7f4ee]',
                added && 'border-[#9a7634] text-[#80612d]',
              )}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Ajouté
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Ajouter au panier
                </>
              )}
            </button>
            <Link
              href={`/parfums/${product.slug}`}
              className="btn-outline border-[#cfc3b2] px-3 py-3 text-xs text-[#3b3732] hover:border-[#9a7634] hover:bg-[#f7f4ee]"
              aria-label={`Voir le parfum ${product.name}`}
            >
              Voir le parfum
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}