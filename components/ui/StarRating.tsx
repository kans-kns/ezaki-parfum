import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  /** Note sur 5, ex : 4.9 */
  rating: number;
  /** Nombre d'avis, affiche a cote des etoiles si fourni. */
  count?: number;
  className?: string;
  size?: number;
};

/** Etoiles dores, utilisees dans les cartes produit et les avis. */
export default function StarRating({ rating, count, className, size = 14 }: StarRatingProps) {
  const rounded = Math.round(rating);
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="flex items-center" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            width={size}
            height={size}
            className={cn(
              'transition-colors',
              index < rounded ? 'fill-gold text-gold' : 'text-cream/25',
            )}
          />
        ))}
      </span>
      <span className="text-xs text-cream/60">
        {rating.toFixed(1).replace('.', ',')}
        {typeof count === 'number' ? ` (${count})` : ''}
      </span>
      <span className="sr-only">
        Note {rating.toFixed(1)} sur 5{typeof count === 'number' ? `, ${count} avis` : ''}
      </span>
    </span>
  );
}