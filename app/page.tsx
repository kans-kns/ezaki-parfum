import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import TrustBenefits from '@/components/home/TrustBenefits';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoBanner from '@/components/home/PromoBanner';
import OrderSteps from '@/components/home/OrderSteps';
import AboutSection from '@/components/home/AboutSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import InstagramSection from '@/components/home/InstagramSection';
import type { Product } from '@/lib/products';
import { getPublicProducts } from '@/lib/products-catalog';
import { site } from '@/lib/site';
import { reviews } from '@/lib/content';

export const metadata: Metadata = {
  title: 'EZAKI Parfum | Parfums de Luxe au Maroc',
  description: site.description,
  alternates: { canonical: '/' },
};

/** Donnees structurees (SEO) : boutique, produits et avis. */
function StructuredData({ products }: { products: Product[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Store',
        '@id': 'https://ezakiparfum.ma/#store',
        name: site.name,
        description: site.description,
        slogan: site.tagline,
        telephone: site.phoneIntl,
        currenciesAccepted: 'MAD',
        paymentAccepted: 'Paiement à la livraison (espèces)',
        areaServed: { '@type': 'Country', name: 'Maroc' },
        sameAs: [site.instagramUrl],
        address: { '@type': 'PostalAddress', addressCountry: 'MA' },
        priceRange: products.length
          ? `${Math.min(...products.map((p) => p.price))}–${Math.max(
              ...products.map((p) => p.price),
            )} DH`
          : 'N/A',
      },
      {
        '@type': 'ItemList',
        name: 'Collection EZAKI Parfum',
        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `/parfums/${product.slug}`,
          name: product.name,
        })),
      },
      ...reviews.slice(0, 3).map((review) => ({
        '@type': 'Review',
        reviewBody: review.quote,
        author: { '@type': 'Person', name: review.author },
        reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: 5 },
        itemReviewed: { '@type': 'Product', name: review.product ?? site.name },
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function HomePage() {
  const products = await getPublicProducts();

  return (
    <>
      <StructuredData products={products} />
      <Hero products={products} />
      <TrustBenefits />
      <FeaturedProducts products={products} />
      <PromoBanner products={products} />
      <OrderSteps />
      <InstagramSection products={products} />
      <ReviewsSection />
      <AboutSection />
    </>
  );
}