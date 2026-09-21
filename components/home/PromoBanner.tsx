import Link from 'next/link';
import { Percent, Truck } from 'lucide-react';
import type { Product } from '@/lib/products';
import { site } from '@/lib/site';
import { buildWhatsAppUrl, generalOrderMessage } from '@/lib/whatsapp';
import Reveal from '@/components/ui/Reveal';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

/** Bandeau promotionnel premium : noir profond + degrades dores. */
export default function PromoBanner({ products }: { products: Product[] }) {
  const priceFrom = products.length ? Math.min(...products.map((product) => product.price)) : null;

  return (
    <section className="container-x py-16 sm:py-24" aria-labelledby="offre-title">
      <Reveal className="relative overflow-hidden rounded-[2rem] border border-[#e1d7c8] bg-[#eee8dd] p-8 shadow-[0_24px_60px_-42px_rgba(27,26,24,0.45)] sm:p-12 lg:p-16">

        <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div className="flex flex-col gap-4">
            <p className="eyebrow mx-auto lg:mx-0">
              <Percent className="h-3.5 w-3.5" aria-hidden="true" />
              Offre du moment
            </p>

            <h2 id="offre-title" className="max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
              Parfums de luxe,{' '}
              <span className="text-[#9a7634]">
                {priceFrom === null ? '—' : `${priceFrom} DH`}
              </span>
            </h2>

            <p className="flex items-center justify-center gap-2 text-sm text-[#766e64] lg:justify-start">
              <Truck className="h-4 w-4 text-[#9a7634]" aria-hidden="true" />
              Une expérience olfactive unique — {site.freeDelivery}
            </p>

            <p className="text-xs uppercase tracking-[0.24em] text-[#81786d]">
              Découvrez la collection EZAKI
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col">
            <a
              href={buildWhatsAppUrl(generalOrderMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-7 py-3.5"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Commander maintenant
            </a>
            <Link href="/parfums" className="btn-outline border-[#cfc3b2] text-[#3b3732] hover:border-[#9a7634] hover:bg-white px-7 py-3.5">
              Explorer maintenant
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}