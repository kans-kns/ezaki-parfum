import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import CartPageContent from '@/components/cart/CartPageContent';
import Reveal from '@/components/ui/Reveal';
import ProductCard from '@/components/product/ProductCard';
import { getPublicProducts } from '@/lib/products-catalog';

export const metadata: Metadata = {
  title: 'Panier & commande',
  description:
    'Vérifiez votre panier EZAKI Parfum puis envoyez votre commande sur WhatsApp. Livraison gratuite partout au Maroc et paiement à la livraison.',
  alternates: { canonical: '/panier' },
  robots: { index: false, follow: true },
};

export default async function PanierPage() {
  const products = await getPublicProducts();
  const suggestions = products.filter((product) => product.featured).slice(0, 3);

  return (
    <>
      <section className="border-b border-gold/10 bg-ink-soft/40 py-10 sm:py-14">
        <div className="container-x flex flex-col gap-4">
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-cream/50">
            <Link href="/" className="hover:text-gold-light">
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-gold-light">Panier</span>
          </nav>

          <Reveal className="flex flex-col gap-3">
            <p className="eyebrow">Votre commande</p>
            <h1 className="text-3xl leading-tight sm:text-4xl">
              Mon <span className="gold-gradient-text">panier</span>
            </h1>
            <span className="hairline max-w-[120px]" aria-hidden="true" />
            <p className="max-w-2xl text-sm text-cream/65 sm:text-base">
              Vérifiez vos parfums, indiquez vos coordonnées puis envoyez votre commande en un clic
              sur WhatsApp.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16">
        <h2 className="sr-only">Contenu du panier</h2>
        <CartPageContent />
      </section>

      <section className="container-x pb-16 sm:pb-20" aria-labelledby="suggestions-title">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <p className="eyebrow">Complétez votre commande</p>
          <h2 id="suggestions-title" className="text-2xl sm:text-3xl">
            Nos <span className="gold-gradient-text">best-sellers</span>
          </h2>
          <span className="hairline max-w-[120px]" aria-hidden="true" />
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((product, index) => (
            <Reveal key={product.slug} delay={index * 90}>
              <ProductCard product={product} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}