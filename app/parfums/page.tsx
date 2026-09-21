import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import { getPublicProducts } from '@/lib/products-catalog';
import { site } from '@/lib/site';
import ProductGrid from '@/components/product/ProductGrid';
import Reveal from '@/components/ui/Reveal';
import PromoBanner from '@/components/home/PromoBanner';

export const metadata: Metadata = {
  title: 'Nos parfums — Collection EZAKI',
  description:
    'Découvrez la collection EZAKI Parfum à partir de 50 DH. Livraison gratuite partout au Maroc, commande via WhatsApp.',
  alternates: { canonical: '/parfums' },
  openGraph: {
    title: 'Nos parfums — Collection EZAKI',
    description:
      'Toute la collection EZAKI Parfum, avec des offres et parfums disponibles à la commande.',
    url: '/parfums',
  },
};

export default async function ParfumsPage() {
  const products = await getPublicProducts();

  return (
    <>
      <section className="border-b border-[#e7e0d4] bg-white/70 py-12 sm:py-16">
        <div className="container-x flex flex-col gap-4">
          <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-2 text-xs text-[#9a9188]">
            <Link href="/" className="hover:text-[#80612d]">
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-[#80612d]">Parfums</span>
          </nav>

          <Reveal className="flex flex-col gap-3">
            <span className="font-display text-lg text-[#9a7634]/70" dir="rtl" lang="ar">
              عطورنا
            </span>
            <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
              La collection <span className="text-[#9a7634]">EZAKI Parfum</span>
            </h1>
            <span className="hairline max-w-[120px]" aria-hidden="true" />
            <p className="max-w-2xl text-sm leading-relaxed text-[#766e64] sm:text-base">
              {products.length} fragrances longue tenue, créées pour laisser une impression
              durable. {site.freeDelivery} et paiement à la livraison dans tout le pays.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16">
        <h2 className="sr-only">Liste des parfums disponibles</h2>
        <ProductGrid products={products} />
      </section>

      <PromoBanner products={products} />
    </>
  );
}