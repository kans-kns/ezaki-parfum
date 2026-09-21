import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/products';
import Reveal from '@/components/ui/Reveal';
import ProductCard from '@/components/product/ProductCard';

/** Selection de parfums mis en avant sur la page d'accueil. */
export default function FeaturedProducts({ products }: { products: Product[] }) {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 6);

  return (
    <section id="parfums" className="border-y border-[#e7e0d4] bg-white py-16 sm:py-24" aria-labelledby="parfums-title">
      <div className="container-x">
      <Reveal className="flex flex-col items-center gap-3 text-center">
        <p className="eyebrow">Collection</p>
        <h2 id="parfums-title" className="text-3xl sm:text-4xl">
          Nos <span className="text-[#9a7634]">parfums</span>
        </h2>
        <span className="hairline max-w-[120px]" aria-hidden="true" />
        <p className="max-w-2xl text-sm leading-relaxed text-[#766e64] sm:text-base">
          Les essentiels sélectionnés pour vous, disponibles partout au Maroc.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
        {featuredProducts.map((product, index) => (
          <Reveal key={product.slug} delay={(index % 3) * 100}>
            <ProductCard product={product} className="h-full" />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 flex justify-center">
        <Link href="/parfums" className="btn-outline border-[#cfc3b2] text-[#3b3732] hover:border-[#9a7634] hover:bg-[#f7f4ee] px-7 py-3.5">
          Voir toute la collection
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Reveal>
      </div>
    </section>
  );
}