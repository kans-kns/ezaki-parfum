'use client';

import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from './CartProvider';

type CartButtonProps = {
  className?: string;
  /** Style clair pour la navbar, contour pour les fonds dores. */
  variant?: 'navbar' | 'floating';
  label?: boolean;
};

/** Icone panier avec compteur d'articles. Ouvre le tiroir panier. */
export default function CartButton({
  className,
  variant = 'navbar',
  label = false,
}: CartButtonProps) {
  const { count, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={count > 0 ? `Ouvrir le panier (${count} articles)` : 'Ouvrir le panier'}
      className={cn(
        'relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border transition-all duration-300 ease-luxe',
        variant === 'navbar'
          ? 'luxury-icon-button'
          : 'border-[#d8cdbd] bg-white px-4 py-2.5 text-[#3b3732] hover:border-[#9a7634]',
        className,
      )}
    >
      <ShoppingBag className="h-5 w-5" aria-hidden="true" />
      {label ? <span className="text-sm">Panier</span> : null}
      {count > 0 ? (
        <span className="luxury-cart-badge">
          {count}
        </span>
      ) : null}
    </button>
  );
}

/** Selecteur de quantite reutilisable (cartes, panier, page produit). */
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 20,
  className,
  size = 'md',
  ariaLabel = 'Quantité',
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}) {
  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';

  const update = (next: number) => {
    onChange(Math.min(Math.max(next, min), max));
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-[#d8cdbd] bg-white',
        className,
      )}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={() => update(value - 1)}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
        className={cn(
          'grid place-items-center rounded-full text-[#766e64] transition-colors hover:text-[#80612d] disabled:opacity-35',
          buttonSize,
        )}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className={cn('min-w-8 text-center font-medium text-[#3b3732]', size === 'sm' ? 'text-sm' : '')}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => update(value + 1)}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
        className={cn(
          'grid place-items-center rounded-full text-[#766e64] transition-colors hover:text-[#80612d] disabled:opacity-35',
          buttonSize,
        )}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}