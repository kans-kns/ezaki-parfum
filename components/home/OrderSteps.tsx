import { CreditCard, MessageCircle, PackageCheck, Truck } from 'lucide-react';
import { site } from '@/lib/site';
import Reveal from '@/components/ui/Reveal';

const steps = [
  {
    icon: MessageCircle,
    title: 'Choisissez votre parfum',
    description:
      'Parcourez la collection puis cliquez sur « Commander sur WhatsApp » : le message est déjà pré-rempli.',
  },
  {
    icon: PackageCheck,
    title: 'Confirmez vos informations',
    description:
      'Envoyez-nous votre nom, votre ville et votre numéro de téléphone directement sur WhatsApp.',
  },
  {
    icon: Truck,
    title: 'Recevez votre commande',
    description:
      'Nous expédions sous 24h et la livraison est gratuite partout au Maroc, généralement en 24 à 72h.',
  },
  {
    icon: CreditCard,
    title: 'Payez à la livraison',
    description:
      'Vous ne payez qu\'à la réception de votre colis, en espèces, auprès du livreur.',
  },
];

/** Comment commander : rassure et simplifie le parcours d'achat. */
export default function OrderSteps() {
  return (
    <section className="container-x py-16 sm:py-20" aria-labelledby="commander-title">
      <Reveal className="flex flex-col items-center gap-3 text-center">
        <p className="eyebrow">Commande simple</p>
        <h2 id="commander-title" className="text-3xl sm:text-4xl">
          Comment <span className="text-[#9a7634]">commander</span> ?
        </h2>
        <span className="hairline max-w-[120px]" aria-hidden="true" />
        <p className="max-w-2xl text-sm leading-relaxed text-[#766e64] sm:text-base">
          Aucun compte à créer, aucune carte bancaire : tout se passe par WhatsApp en moins de deux
          minutes.
        </p>
      </Reveal>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <Reveal
            key={step.title}
            as="li"
            delay={index * 90}
            className="relative flex h-full flex-col gap-3 rounded-3xl border border-[#e7e0d4] bg-white p-6 shadow-[0_18px_45px_-38px_rgba(27,26,24,0.4)]"
          >
            <span
              className="font-display text-4xl text-gold/25"
              aria-hidden="true"
            >{`0${index + 1}`}</span>
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#dfd2bf] bg-[#f7f4ee] text-[#9a7634]">
              <step.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="font-display text-lg leading-snug">{step.title}</h3>
            <p className="text-sm leading-relaxed text-[#766e64]">{step.description}</p>
          </Reveal>
        ))}
      </ol>

      <Reveal className="mt-8 text-center text-xs uppercase tracking-[0.2em] text-[#9a9188]">
        Une question ? Appelez le {site.phone} — {site.openingHours}
      </Reveal>
    </section>
  );
}