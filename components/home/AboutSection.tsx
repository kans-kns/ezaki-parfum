import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gem, Heart, Truck } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { brandImage } from '@/lib/images';
import { site } from '@/lib/site';
import { buildWhatsAppUrl, generalOrderMessage } from '@/lib/whatsapp';

const pillars = [
  { icon: Gem, label: 'Fragrances sélectionnées' },
  { icon: Heart, label: 'Élégance accessible' },
  { icon: Truck, label: 'Livraison dans tout le Maroc' },
];

/** Presentation de la marque sur la page d'accueil. */
export default function AboutSection() {
  return (
    <section className="container-x py-16 sm:py-20" aria-labelledby="about-title">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal className="relative">
          <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] border border-[#e1d7c8] bg-[#f7f4ee] shadow-[0_24px_60px_-42px_rgba(27,26,24,0.5)]">
            <Image
              src={brandImage('packaging', '/images/brand/packaging.svg')}
              alt="Coffret cadeau EZAKI Parfum noir et doré"
              fill
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="object-cover transition-transform duration-700 ease-luxe hover:scale-[1.02]"
            />
          </div>

          <div className="absolute -bottom-6 right-4 w-44 rounded-2xl border border-[#e1d7c8] bg-white/95 px-4 py-3 text-center shadow-[0_18px_45px_-30px_rgba(27,26,24,0.5)] backdrop-blur sm:right-8">
            <p className="font-display text-2xl text-[#80612d]">100%</p>
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-[#81786d]">
              Clients satisfaits
            </p>
          </div>
        </Reveal>

        <Reveal delay={120} className="flex flex-col gap-5">
          <span className="font-display text-lg text-[#9a7634]/70" dir="rtl" lang="ar">
            من نحن
          </span>
          <p className="eyebrow">Notre histoire</p>

          <h2 id="about-title" className="text-3xl leading-tight sm:text-4xl">
            À propos de <span className="text-[#9a7634]">EZAKI</span>
          </h2>
          <span className="hairline max-w-[120px]" aria-hidden="true" />

          <p className="text-sm leading-relaxed text-[#5f5951] sm:text-base">
            EZAKI Parfum est une marque marocaine dédiée à la parfumerie élégante et accessible.
            Nous sélectionnons des fragrances inspirées par le luxe afin d’offrir à nos clients une
            expérience parfumée raffinée, avec une livraison partout au Maroc.
          </p>

          <ul className="mt-1 flex flex-col gap-3">
            {pillars.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-[#5f5951]">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-[#dfd2bf] bg-[#f7f4ee] text-[#9a7634]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#80612d]">
            <span>{site.qualityLine}</span>
            <span className="text-gold/40" aria-hidden="true">
              •
            </span>
            <span>{site.freeDelivery}</span>
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link href="/a-propos" className="btn-outline px-6 py-3">
              En savoir plus
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={buildWhatsAppUrl(generalOrderMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-6 py-3"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Commander sur WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}