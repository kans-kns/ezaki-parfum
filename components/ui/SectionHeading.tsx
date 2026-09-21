import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Reveal from './Reveal';

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  /** Petit mot arabe decoratif affiche au-dessus du titre. */
  arabic?: string;
};

/** Titre de section homogene sur tout le site. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  arabic,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {arabic ? (
        <span className="font-display text-lg text-gold/60" dir="rtl" lang="ar">
          {arabic}
        </span>
      ) : null}

      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}

      <h2 className="max-w-3xl text-balance text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>

      <span
        className={cn('hairline max-w-[120px]', align === 'center' ? 'mx-auto' : '')}
        aria-hidden="true"
      />

      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-[#766e64] sm:text-base">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}