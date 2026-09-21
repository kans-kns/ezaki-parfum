import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Award, Gem, HeartHandshake, Sparkles } from 'lucide-react';
import { site } from '@/lib/site';
import { brandStats } from '@/lib/content';
import { buildWhatsAppUrl, generalOrderMessage } from '@/lib/whatsapp';
import Reveal from '@/components/ui/Reveal';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { brandImage } from '@/lib/images';

export const metadata: Metadata = {
  title: 'À propos — La maison EZAKI',
  description:
    "EZAKI Parfum est une marque marocaine dédiée à la parfumerie élégante et accessible. Découvrez notre histoire, nos valeurs et notre service de livraison partout au Maroc.",
  alternates: { canonical: '/a-propos' },
};

const values = [
  {
    icon: Gem,
    title: 'Qualité premium',
    text: 'Des essences sélectionnées pour leur tenue et leur sillage, présentées dans un flacon élégant à prix juste.',
  },
  {
    icon: HeartHandshake,
    title: 'Proximité',
    text: 'Une équipe marocaine disponible 7j/7 sur WhatsApp, qui conseille et suit chaque commande.',
  },
  {
    icon: Award,
    title: 'Confiance',
    text: 'Paiement à la livraison, livraison gratuite et échanges possibles : vous commandez sans risque.',
  },
];

const milestones = [
  {
    title: 'La sélection',
    text: 'Nous testons et sélectionnons chaque fragrance avant de la proposer : tenue, sillage et élégance du flacon.',
  },
  {
    title: 'Le service',
    text: 'Commande par WhatsApp en deux minutes, confirmation immédiate, expédition sous 24h et suivi personnalisé.',
  },
  {
    title: 'La livraison',
    text: 'Toutes les villes du Maroc sont desservies gratuitement, avec paiement à la réception du colis.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-[#e7e0d4] bg-white/70 py-12 sm:py-16">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="flex flex-col gap-4">
            <span className="font-display text-lg text-[#9a7634]/70" dir="rtl" lang="ar">
              من نحن
            </span>
            <p className="eyebrow">Notre histoire</p>
            <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
              À propos de <span className="text-[#9a7634]">EZAKI</span>
            </h1>
            <span className="hairline max-w-[120px]" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-[#5f5951] sm:text-base">
              EZAKI Parfum est une marque marocaine dédiée à la parfumerie élégante et accessible.
              Nous sélectionnons des fragrances inspirées par le luxe afin d’offrir à nos clients
              une expérience parfumée raffinée, avec une livraison partout au Maroc.
            </p>
            <p className="text-sm leading-relaxed text-[#766e64]">
              {site.qualityLine} — livraison gratuite et paiement à la livraison dans tout le pays.
            </p>

            <dl className="mt-2 grid grid-cols-3 gap-4 border-t border-[#e7e0d4] pt-6">
              {brandStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-[#81786d]">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-2xl text-[#80612d]">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link href="/parfums" className="btn-gold px-6 py-3">
                Découvrir nos parfums
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={buildWhatsAppUrl(generalOrderMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-6 py-3"
              >
                <WhatsAppIcon className="h-5 w-5 text-gold" />
                Commander sur WhatsApp
              </a>
            </div>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] border border-[#e1d7c8] bg-[#f7f4ee] shadow-[0_24px_60px_-42px_rgba(27,26,24,0.5)]">
              <Image
                src={brandImage('lifestyle', '/images/brand/lifestyle.svg')}
                alt="Univers EZAKI Parfum : élégance et raffinement"
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover transition-transform duration-700 ease-luxe hover:scale-[1.02]"
              />
              <span
                className="frame-corners pointer-events-none absolute inset-0"
                aria-hidden="true"
              />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="container-x py-16 sm:py-20" aria-labelledby="valeurs-title">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <p className="eyebrow">Nos valeurs</p>
          <h2 id="valeurs-title" className="text-3xl sm:text-4xl">
          Ce qui nous <span className="text-[#9a7634]">distingue</span>
          </h2>
          <span className="hairline max-w-[120px]" aria-hidden="true" />
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {values.map(({ icon: Icon, title, text }, index) => (
            <Reveal
              key={title}
              as="li"
              delay={index * 90}
              className="flex h-full flex-col gap-4 rounded-3xl border border-[#e7e0d4] bg-white p-6 shadow-[0_18px_45px_-38px_rgba(27,26,24,0.4)]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#dfd2bf] bg-[#f7f4ee] text-[#9a7634]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-xl">{title}</h3>
              <p className="text-sm leading-relaxed text-[#766e64]">{text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-x pb-16 sm:pb-20" aria-labelledby="parcours-title">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <p className="eyebrow">Notre façon de travailler</p>
          <h2 id="parcours-title" className="text-3xl sm:text-4xl">
            De la sélection à votre <span className="text-[#9a7634]">porte</span>
          </h2>
          <span className="hairline max-w-[120px]" aria-hidden="true" />
        </Reveal>

        <ol className="mt-10 grid gap-4 sm:grid-cols-3">
          {milestones.map((item, index) => (
            <Reveal
              key={item.title}
              as="li"
              delay={index * 90}
              className="flex h-full flex-col gap-3 rounded-3xl border border-[#e7e0d4] bg-white p-6 shadow-[0_18px_45px_-38px_rgba(27,26,24,0.4)]"
            >
              <span className="font-display text-4xl text-[#cdbb9d]" aria-hidden="true">
                {`0${index + 1}`}
              </span>
              <h3 className="font-display text-lg">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[#766e64]">{item.text}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10 flex flex-col items-center gap-4 rounded-[2rem] border border-[#e1d7c8] bg-[#eee8dd] p-8 text-center">
          <Sparkles className="h-6 w-6 text-[#9a7634]" aria-hidden="true" />
          <p className="max-w-2xl font-display text-2xl leading-snug text-[#2e2b27]">
            « {site.tagline} »
          </p>
          <p className="font-display text-base text-[#9a7634]/80" dir="rtl" lang="ar">
            {site.taglineArabic}
          </p>
          <p className="text-sm text-[#766e64]">
            {site.positioning} — {site.phone}
          </p>
          <a
            href={buildWhatsAppUrl(generalOrderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-7 py-3.5"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Commander sur WhatsApp
          </a>
        </Reveal>
      </section>
    </>
  );
}