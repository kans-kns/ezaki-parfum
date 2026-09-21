import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgePercent,
  Bookmark,
  Gift,
  Sparkles,
  Star,
  Wine,
  type LucideIcon,
} from 'lucide-react';
import { instagramGrid, type GalleryItem } from '@/lib/content';
import { site } from '@/lib/site';
import type { Product } from '@/lib/products';
import { cn } from '@/lib/utils';
import { instagramImage, productImage } from '@/lib/images';
import Reveal from '@/components/ui/Reveal';
import { Instagram as InstagramIcon } from 'lucide-react';

const icons: Record<GalleryItem['icon'], LucideIcon> = {
  bottle: Wine,
  star: Star,
  gift: Gift,
  sparkle: Sparkles,
  new: Bookmark,
  percent: BadgePercent,
};

/**
 * Section inspiree du contenu Instagram de la marque :
 * grille de visuels editoriaux, sans embed Instagram.
 */
export default function InstagramSection({ products }: { products: Product[] }) {
  return (
    <section className="container-x py-16 sm:py-24" aria-labelledby="instagram-title">
      <Reveal className="flex flex-col items-center gap-3 text-center">
        <p className="eyebrow">@ezaki_parfum</p>
        <h2 id="instagram-title" className="text-3xl sm:text-4xl">
          Suivez <span className="text-[#9a7634]">EZAKI Parfum</span>
        </h2>
        <span className="hairline max-w-[120px]" aria-hidden="true" />
        <p className="max-w-2xl text-sm leading-relaxed text-[#766e64] sm:text-base">
          Nouveautés, avis clients, coffrets cadeaux et offres exclusives : retrouvez notre
          univers sur Instagram {site.instagramHandle}.
        </p>
      </Reveal>

      <ul className="mt-10 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[170px] sm:grid-cols-3 lg:grid-cols-4">
        {instagramGrid.map((item, index) => {
          const Icon = icons[item.icon];
          const product = products.length ? products[index % products.length] : undefined;
          return (
            <Reveal
              key={item.label}
              as="li"
              delay={(index % 4) * 80}
              className={cn(
                'group relative overflow-hidden rounded-2xl border border-[#e7e0d4] bg-white shadow-[0_18px_45px_-38px_rgba(27,26,24,0.45)]',
                item.span === 'tall' && 'row-span-2',
                item.span === 'wide' && 'col-span-2',
              )}
            >
              <Image
                src={instagramImage(index, product ? productImage(product) : '/images/brand/ambience.svg')}
                alt={`${item.caption} — EZAKI Parfum`}
                fill
                sizes="(max-width: 640px) 45vw, 24vw"
                className="object-cover opacity-80 transition-all duration-700 ease-luxe group-hover:scale-110 group-hover:opacity-100"
              />
              <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4">
                <span className="flex items-center gap-2 text-[#f1dcae]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/75">
                    {item.label}
                  </span>
                </span>
                <p className="font-display text-base leading-snug text-white">{item.caption}</p>
              </div>
            </Reveal>
          );
        })}
      </ul>

      <Reveal className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold px-7 py-3.5"
        >
          <InstagramIcon className="h-5 w-5" aria-hidden="true" />
          Voir notre Instagram
        </a>
        <Link href="/parfums" className="btn-outline border-[#cfc3b2] text-[#3b3732] hover:border-[#9a7634] hover:bg-white px-7 py-3.5">
          Commander nos parfums
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}