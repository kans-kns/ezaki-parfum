import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { brandStats } from '@/lib/content';
import type { Product } from '@/lib/products';
import { site } from '@/lib/site';
import { buildWhatsAppUrl, generalOrderMessage } from '@/lib/whatsapp';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { brandImage, productImage } from '@/lib/images';

/**
 * Hero d'accueil : fond noir profond, halos dores animes,
 * visuel de flacon premium et double appel a l'action (boutique + WhatsApp).
 */
export default function Hero({ products }: { products: Product[] }) {
  const priceFrom = products.length ? Math.min(...products.map((product) => product.price)) : null;
  const heroProduct = products[0];
  const heroImage = heroProduct ? productImage(heroProduct) : brandImage('hero', '/images/brand/ambience.svg');

  return (
    <section className="relative overflow-hidden border-b border-[#e7e0d4] bg-[#f7f4ee]" aria-labelledby="hero-title">
      <div className="container-x grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-28">
        {/* Texte */}
        <div className="flex animate-fade-up flex-col gap-6 text-center lg:text-left">
          <p className="eyebrow mx-auto lg:mx-0">{site.positioning}</p>
          <p className="font-display text-sm tracking-[0.25em] text-[#9a7634]" dir="rtl" lang="ar">
            {site.taglineArabic}
          </p>

          <h1
            id="hero-title"
            className="max-w-2xl font-display text-4xl leading-[1.05] tracking-tight text-[#1b1a18] sm:text-5xl lg:text-7xl"
          >
            L&apos;art de la <span className="text-[#9a7634]">séduction</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-[#5f5951] sm:text-lg lg:max-w-lg">
            Des parfums qui racontent votre histoire, imaginés pour laisser une impression
            inoubliable.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/parfums" className="group btn-gold px-7 py-3.5">
              Découvrir la collection
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href={buildWhatsAppUrl(generalOrderMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-[#cfc3b2] text-[#3b3732] hover:border-[#9a7634] hover:bg-white"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#80612d]" />
              Commander sur WhatsApp
            </a>
          </div>

          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#766e64] lg:justify-start">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{site.freeDelivery}</span>
            <span aria-hidden="true">•</span>
            <span>Paiement à la livraison</span>
            <span aria-hidden="true">•</span>
            <span>À partir de {priceFrom === null ? '—' : `${priceFrom} DH`}</span>
          </p>

          <dl className="mt-2 grid max-w-lg grid-cols-3 gap-4 border-t border-[#e2d9cc] pt-6">
            {brandStats.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <dt className="order-2 text-[0.62rem] uppercase tracking-[0.16em] text-[#81786d]">
                  {stat.label}
                </dt>
                <dd className="order-1 font-display text-2xl text-[#9a7634]">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visuel */}
        <div className="relative mx-auto w-full max-w-md animate-fade-up [animation-delay:150ms] lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#e0d7ca] bg-white p-3 shadow-[0_28px_70px_-42px_rgba(27,26,24,0.5)]">
            <Image
              src={heroImage}
              alt={heroProduct ? `Parfum ${heroProduct.name}` : 'Parfum de luxe EZAKI Parfum'}
              fill
              priority
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 55vw, 42vw"
              className="object-cover rounded-[1.5rem] transition-transform duration-1000 ease-luxe hover:scale-[1.03]"
            />
          </div>

          {/* Carte flottante */}
          <div className="absolute -bottom-5 left-1/2 w-[82%] -translate-x-1/2 rounded-2xl border border-[#e0d7ca] bg-white/95 px-4 py-3 shadow-[0_18px_45px_-30px_rgba(27,26,24,0.5)] backdrop-blur sm:left-6 sm:w-auto sm:translate-x-0">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#81786d]">
              Commande directe
            </p>
            <p className="font-display text-lg text-[#80612d]">{site.phone}</p>
            <p className="text-[0.7rem] text-[#766e64]">{site.openingHours}</p>
          </div>
        </div>
      </div>
    </section>
  );
}