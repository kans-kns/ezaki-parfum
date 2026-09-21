import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { site } from '@/lib/site';

type LogoProps = {
  className?: string;
  /** Affiche aussi "PARFUM" sous EZAKI. */
  showSubtitle?: boolean;
  href?: string | null;
  size?: 'sm' | 'md' | 'lg';
};

/**
 * Logo texte EZAKI PARFUM avec monogramme dore.
 * Sans lien par defaut pour pouvoir l'utiliser dans le footer.
 */
export default function Logo({
  className,
  showSubtitle = true,
  href = '/',
  size = 'md',
}: LogoProps) {
  const sizes = {
    sm: { mark: 30, text: 'text-base', sub: 'text-[0.5rem]' },
    md: { mark: 38, text: 'text-lg sm:text-xl', sub: 'text-[0.55rem]' },
    lg: { mark: 52, text: 'text-2xl sm:text-3xl', sub: 'text-[0.65rem]' },
  }[size];

  const content = (
    <span className={cn('group flex items-center gap-2.5', className)}>
      <Image
        src="/images/brand/logo-mark.svg"
        alt=""
        width={sizes.mark}
        height={sizes.mark}
        className="transition-transform duration-500 ease-luxe group-hover:rotate-6"
        priority={size === 'md'}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display font-semibold tracking-[0.22em] text-[#2e2b27] transition-colors duration-300 group-hover:text-[#80612d]',
            sizes.text,
          )}
        >
          {site.nameParts.left}
        </span>
        {showSubtitle ? (
          <span
            className={cn(
              'mt-1 font-sans font-medium uppercase tracking-[0.42em] text-[#6c665d]',
              sizes.sub,
            )}
          >
            {site.nameParts.right}
          </span>
        ) : null}
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label={`${site.name} — retour à l'accueil`} className="inline-flex">
      {content}
    </Link>
  );
}