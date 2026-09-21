import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';
import { getPublicProducts } from '@/lib/products-catalog';
import { site } from '@/lib/site';
import { buildWhatsAppUrl, generalOrderMessage } from '@/lib/whatsapp';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import ProductCard from '@/components/product/ProductCard';

/** Page 404 sur mesure, dans l'esprit de la marque. */
export default async function NotFound() {
  const products = await getPublicProducts();

  return (
    <>
      <section className="container-x flex flex-col items-center gap-6 py-20 text-center sm:py-28">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="text-3xl sm:text-5xl">
          Cette page a <span className="gold-gradient-text">disparu</span>
        </h1>
        <span className="hairline max-w-[140px]" aria-hidden="true" />
        <p className="max-w-xl text-sm leading-relaxed text-cream/65 sm:text-base">
          La page recherchée n&apos;existe plus ou a été déplacée. Découvrez nos parfums ou
          commandez directement sur WhatsApp — {site.freeDelivery.toLowerCase()}.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-gold px-6 py-3">
            <Home className="h-4 w-4" aria-hidden="true" />
            Retour à l&apos;accueil
          </Link>
          <Link href="/parfums" className="btn-outline px-6 py-3">
            Voir les parfums
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={buildWhatsAppUrl(generalOrderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline px-6 py-3"
          >
            <WhatsAppIcon className="h-5 w-5 text-gold" />
            WhatsApp
          </a>
        </div>
      </section>

      <section className="container-x pb-16 sm:pb-20">
        <h2 className="mb-8 text-center font-display text-2xl">Nos parfums les plus demandés</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.slug} product={product} className="h-full" />
          ))}
        </div>
      </section>
    </>
  );
}