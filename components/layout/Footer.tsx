import Link from 'next/link';
import { Instagram, MapPin, Phone, Truck } from 'lucide-react';
import { navLinks, site } from '@/lib/site';
import type { Product } from '@/lib/products';
import { buildWhatsAppUrl, generalOrderMessage } from '@/lib/whatsapp';
import Logo from '@/components/ui/Logo';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

/** Pied de page : navigation, contact, livraison et mentions. */
export default function Footer({ products }: { products: Product[] }) {
  const whatsappHref = buildWhatsAppUrl(generalOrderMessage);

  return (
    <footer className="mt-24 border-t border-[#e7e0d4] bg-white">
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-5">
          <Logo size="lg" />
          <p className="font-display text-lg text-[#80612d]">{site.tagline}</p>
          <p className="max-w-sm text-sm leading-relaxed text-[#766e64]">
            {site.name} — {site.positioning}. Des fragrances élégantes, une tenue longue durée et
            une livraison gratuite dans tout le Royaume.
          </p>
          <p className="font-display text-base text-[#9a7634]/80" dir="rtl" lang="ar">
            {site.taglineArabic}
          </p>
        </div>

        <nav aria-label="Navigation du pied de page" className="flex flex-col gap-4">
          <h2 className="font-display text-base tracking-wide text-[#2e2b27]">Navigation</h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline text-[#766e64] hover:text-[#80612d]">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/panier" className="link-underline text-[#766e64] hover:text-[#80612d]">
                Panier
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Nos parfums" className="flex flex-col gap-4">
          <h2 className="font-display text-base tracking-wide text-[#2e2b27]">Nos parfums</h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {products.slice(0, 6).map((product) => (
              <li key={product.slug}>
                <Link
                  href={`/parfums/${product.slug}`}
                  className="link-underline text-[#766e64] hover:text-[#80612d]"
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-base tracking-wide text-[#2e2b27]">Nous contacter</h2>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-[#e1d7c8] bg-[#f7f4ee] px-4 py-3 transition-colors hover:border-[#cdbb9d]"
          >
            <WhatsAppIcon className="h-5 w-5 text-gold" />
            <span className="flex flex-col">
              <span className="text-[0.7rem] uppercase tracking-[0.2em] text-[#81786d]">
                WhatsApp
              </span>
              <span className="text-sm text-[#3b3732]">{site.phone}</span>
            </span>
          </a>

          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-[#e1d7c8] bg-[#f7f4ee] px-4 py-3 transition-colors hover:border-[#cdbb9d]"
          >
            <Instagram className="h-5 w-5 text-gold" aria-hidden="true" />
            <span className="flex flex-col">
              <span className="text-[0.7rem] uppercase tracking-[0.2em] text-[#81786d]">
                Instagram
              </span>
              <span className="text-sm text-[#3b3732]">{site.instagramHandle}</span>
            </span>
          </a>

          <a href={site.phoneHref} className="flex items-center gap-3 text-sm text-[#766e64] hover:text-[#80612d]">
            <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
            {site.phone}
          </a>

          <p className="flex items-center gap-3 text-sm text-[#766e64]">
            <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
            {site.country} — {site.openingHours}
          </p>

          <p className="flex items-start gap-3 text-sm text-[#80612d]">
            <Truck className="mt-0.5 h-4 w-4" aria-hidden="true" />
            {site.freeDelivery}
          </p>
        </div>
      </div>

      <div className="border-t border-[#e7e0d4]">
        <div className="container-x flex flex-col items-center gap-3 py-6 text-center text-xs text-[#9a9188] sm:flex-row sm:justify-between sm:text-left">
          <p>{site.copyright}</p>
          <p className="flex flex-wrap items-center justify-center gap-3">
            <span>{site.freeDelivery}</span>
            <span className="hidden text-gold/40 sm:inline" aria-hidden="true">
              
            </span>
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="link-underline">
              {site.instagramHandle}
            </a>
          </p>
        </div>
      </div>

      {/* Espace reserve a la barre mobile fixe */}
      <div className="h-16 sm:hidden" aria-hidden="true" />
    </footer>
  );
}