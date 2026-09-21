import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronRight, Truck } from 'lucide-react';
import { getPublicProducts, getPublicProductBySlug } from '@/lib/products-catalog';
import { formatPrice } from '@/lib/format';
import { site } from '@/lib/site';
import { productImage } from '@/lib/images';
import ProductDetails from '@/components/product/ProductDetails';
import ProductCard from '@/components/product/ProductCard';
import Reveal from '@/components/ui/Reveal';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    return { title: 'Parfum introuvable' };
  }

  const title = `${product.name} — ${product.concentration} ${product.size}`;
  const description = `${product.shortDescription} ${product.name} à ${formatPrice(
    product.price,
  )}. ${site.freeDelivery}, paiement à la livraison et commande via WhatsApp.`;

  return {
    title,
    description,
    alternates: { canonical: `/parfums/${product.slug}` },
    openGraph: {
      title: `${product.name} | EZAKI Parfum`,
      description,
      url: `/parfums/${product.slug}`,
      images: [{ url: productImage(product), width: 800, height: 1000, alt: `${product.name}` }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const products = await getPublicProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [productImage(product)],
    description: product.description,
    brand: { '@type': 'Brand', name: site.name },
    category: product.family,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    },
    offers: {
      '@type': 'Offer',
      url: `/parfums/${product.slug}`,
      priceCurrency: 'MAD',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <section className="container-x py-8 sm:py-12">
        <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-2 text-xs text-[#9a9188]">
          <Link href="/" className="hover:text-[#80612d]">
            Accueil
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <Link href="/parfums" className="hover:text-[#80612d]">
            Parfums
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-[#80612d]">{product.name}</span>
        </nav>

        <div className="mt-8">
          <ProductDetails product={product} />
        </div>

        <p className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[#e7e0d4] bg-white px-4 py-3 text-xs text-[#766e64]">
          <Truck className="h-4 w-4 text-[#9a7634]" aria-hidden="true" />
          {site.freeDelivery}
          <span className="text-[#cdbb9d]" aria-hidden="true">
            •
          </span>
          Livraison en 24 à 72h selon la ville
          <span className="text-[#cdbb9d]" aria-hidden="true">
            •
          </span>
          Paiement à la livraison
        </p>
      </section>

      {related.length > 0 ? (
        <section className="container-x py-12 sm:py-16" aria-labelledby="similaires-title">
          <Reveal className="flex flex-col items-center gap-3 text-center">
            <p className="eyebrow">Vous aimerez aussi</p>
            <h2 id="similaires-title" className="text-2xl sm:text-3xl">
              Autres               <span className="text-[#9a7634]">parfums</span>
            </h2>
            <span className="hairline max-w-[120px]" aria-hidden="true" />
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <Reveal key={item.slug} delay={index * 100}>
                <ProductCard product={item} className="h-full" />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}