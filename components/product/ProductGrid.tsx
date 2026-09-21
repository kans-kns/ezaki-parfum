'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { productCategories, type Product, type ProductCategory } from '@/lib/products';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';

type SortOption = 'recommande' | 'prix-croissant' | 'prix-decroissant' | 'nouveautes';

const sortLabels: Record<SortOption, string> = {
  recommande: 'Recommandés',
  'prix-croissant': 'Prix croissant',
  'prix-decroissant': 'Prix décroissant',
  nouveautes: 'Nouveautés',
};

type Filter = 'Tous' | ProductCategory;

/** Grille de produits avec filtres par categorie et tri par prix. */
export default function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>('Tous');
  const [sort, setSort] = useState<SortOption>('recommande');

  const filters: Filter[] = ['Tous', ...productCategories];

  const visible = useMemo(() => {
    const filtered =
      filter === 'Tous' ? products : products.filter((product) => product.category === filter);

    const sorted = [...filtered];
    switch (sort) {
      case 'prix-croissant':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'prix-decroissant':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'nouveautes':
        sorted.sort((a, b) => Number(b.badge === 'Nouveau') - Number(a.badge === 'Nouveau'));
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
    }
    return sorted;
  }, [products, filter, sort]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-gold/15 bg-ink-soft/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0" role="group" aria-label="Filtrer par catégorie">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-gold/70" aria-hidden="true" />
          {filters.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={filter === option}
              className={cn(
                'shrink-0 rounded-full border px-4 py-1.5 text-xs transition-colors duration-300',
                filter === option
                  ? 'border-gold bg-gold/15 text-gold-light'
                  : 'border-gold/20 text-cream/65 hover:border-gold/50 hover:text-cream',
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3 text-xs text-cream/60">
          <span className="uppercase tracking-[0.2em]">Trier</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="rounded-full border border-gold/20 bg-ink px-3 py-2 text-xs text-cream focus:border-gold/60 focus:outline-none"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-xs uppercase tracking-[0.2em] text-cream/45" aria-live="polite">
        {visible.length} parfum{visible.length > 1 ? 's' : ''} disponible
        {visible.length > 1 ? 's' : ''}
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}