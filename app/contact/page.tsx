import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight, Clock, Instagram, Mail, MapPin, Phone, Truck } from 'lucide-react';
import { site } from '@/lib/site';
import { buildWhatsAppUrl, generalOrderMessage } from '@/lib/whatsapp';
import Reveal from '@/components/ui/Reveal';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import OrderForm from '@/components/contact/OrderForm';
import FaqSection from '@/components/contact/FaqSection';
import DeliveryInfo from '@/components/contact/DeliveryInfo';
import { getPublicProducts } from '@/lib/products-catalog';

export const metadata: Metadata = {
  title: 'Contact & commande WhatsApp',
  description:
    'Commandez vos parfums EZAKI directement sur WhatsApp au 0654117023. Livraison gratuite partout au Maroc, paiement à la livraison, service client 7j/7.',
  alternates: { canonical: '/contact' },
};

const infoCards = [
  {
    icon: Truck,
    title: 'Livraison',
    value: site.freeDelivery,
    note: 'Expédition sous 24h, réception en 24 à 72h',
  },
  {
    icon: Clock,
    title: 'Horaires',
    value: '9h à 22h, 7 jours sur 7',
    note: 'Service client WhatsApp',
  },
  {
    icon: MapPin,
    title: 'Zone desservie',
    value: 'Maroc — toutes les villes',
    note: 'Villes et zones rurales incluses',
  },
];

export default async function ContactPage() {
  const products = await getPublicProducts();
  const whatsappHref = buildWhatsAppUrl(generalOrderMessage);

  return (
    <>
      <section className="border-b border-[#e7e0d4] bg-white/70 py-12 sm:py-16">
        <div className="container-x flex flex-col gap-4">
          <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-2 text-xs text-[#9a9188]">
            <Link href="/" className="hover:text-[#80612d]">
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-[#80612d]">Contact</span>
          </nav>

          <Reveal className="flex flex-col gap-3">
            <span className="font-display text-lg text-[#9a7634]/70" dir="rtl" lang="ar">
              تواصل معنا
            </span>
            <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Contactez <span className="text-[#9a7634]">EZAKI Parfum</span>
            </h1>
            <span className="hairline max-w-[120px]" aria-hidden="true" />
            <p className="max-w-2xl text-sm leading-relaxed text-[#766e64] sm:text-base">
              Une question sur une fragrance, une commande ou la livraison ? Notre service client
              répond 7j/7 sur WhatsApp au {site.phone}.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="container-x grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <Reveal className="flex flex-col gap-5">
          <h2 className="font-display text-2xl">Nos coordonnées</h2>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 rounded-3xl border border-[#e1d7c8] bg-white p-5 shadow-[0_18px_45px_-38px_rgba(27,26,24,0.4)] transition-colors hover:border-[#cdbb9d]"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#dfd2bf] bg-[#f7f4ee] text-[#9a7634]">
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-lg text-[#2e2b27]">WhatsApp — le plus rapide</span>
              <span className="text-sm text-[#80612d]">{site.phone}</span>
              <span className="mt-1 text-xs text-[#81786d]">
                Message pré-rempli, réponse en quelques minutes
              </span>
            </span>
          </a>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={site.phoneHref}
              className="flex items-start gap-3 rounded-3xl border border-[#e7e0d4] bg-white p-4 transition-colors hover:border-[#cdbb9d]"
            >
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#9a7634]" aria-hidden="true" />
              <span className="flex flex-col text-sm">
                <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[#81786d]">
                  Téléphone
                </span>
                <span className="text-[#3b3732]">{site.phone}</span>
              </span>
            </a>

            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-3xl border border-[#e7e0d4] bg-white p-4 transition-colors hover:border-[#cdbb9d]"
            >
              <Instagram className="mt-0.5 h-5 w-5 shrink-0 text-[#9a7634]" aria-hidden="true" />
              <span className="flex flex-col text-sm">
                <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[#81786d]">
                  Instagram
                </span>
                <span className="text-[#3b3732]">{site.instagramHandle}</span>
              </span>
            </a>
          </div>

          <ul className="flex flex-col gap-4">
            {infoCards.map(({ icon: Icon, title, value, note }) => (
              <li
                key={title}
                className="flex items-start gap-3 rounded-3xl border border-[#e7e0d4] bg-white p-4"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#9a7634]" aria-hidden="true" />
                <span className="flex flex-col text-sm">
                  <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[#81786d]">
                    {title}
                  </span>
                  <span className="text-[#3b3732]">{value}</span>
                  <span className="text-xs text-[#81786d]">{note}</span>
                </span>
              </li>
            ))}

            <li className="flex items-start gap-3 rounded-3xl border border-[#e7e0d4] bg-white p-4 text-sm">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#9a7634]" aria-hidden="true" />
              <span className="flex flex-col">
                <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[#81786d]">
                  Boutique en ligne
                </span>
                <a
                  href={site.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-[#80612d]"
                >
                  ezakiparfum.youcan.store
                </a>
              </span>
            </li>
          </ul>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#e1d7c8] bg-[#eee8dd] p-6">
            <p className="font-display text-lg text-[#80612d]">{site.qualityLine}</p>
            <p className="mt-2 text-sm text-[#766e64]">
              Flacons authentiques, fragrances longue tenue, emballage soigné.
            </p>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-gold mt-4">
              <WhatsAppIcon className="h-5 w-5" />
              Commander maintenant
            </a>
          </div>
        </Reveal>

        <Reveal delay={120} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Commande express</p>
            <h2 id="commander" className="font-display text-2xl">
              Formulaire de commande WhatsApp
            </h2>
            <p className="text-sm text-[#766e64]">
              Remplissez vos informations : nous préparons le message WhatsApp pour vous.
            </p>
          </div>
          <OrderForm products={products} />
        </Reveal>
      </section>

      <DeliveryInfo />
      <FaqSection />
    </>
  );
}