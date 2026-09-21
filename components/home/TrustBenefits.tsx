import { HandCoins, Headset, Sparkles, Truck, type LucideIcon } from 'lucide-react';
import { benefits, type Benefit } from '@/lib/content';
import Reveal from '@/components/ui/Reveal';

const icons: Record<Benefit['icon'], LucideIcon> = {
  truck: Truck,
  sparkles: Sparkles,
  'hand-coins': HandCoins,
  headset: Headset,
};

/** Section de confiance : 4 engagements de la marque. */
export default function TrustBenefits() {
  return (
    <section className="container-x py-16 sm:py-24" aria-labelledby="engagements-title">
      <Reveal className="flex flex-col items-center gap-3 text-center">
        <p className="eyebrow">Nos engagements</p>
        <h2 id="engagements-title" className="text-3xl sm:text-4xl">
          Le luxe dans <span className="text-[#9a7634]">chaque détail</span>
        </h2>
        <span className="hairline max-w-[120px]" aria-hidden="true" />
      </Reveal>

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {benefits.map((benefit, index) => {
          const Icon = icons[benefit.icon];
          return (
            <Reveal
              key={benefit.title}
              as="li"
              delay={index * 90}
              className="group flex h-full flex-col gap-4 rounded-2xl border border-[#e7e0d4] bg-white p-4 text-center shadow-[0_18px_45px_-38px_rgba(27,26,24,0.45)] transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-[#cdbb9d] sm:rounded-3xl sm:p-6 sm:text-left"
            >
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl border border-[#dfd2bf] bg-[#f7f4ee] text-[#9a7634] transition-colors duration-500 group-hover:bg-[#efe8dc] sm:mx-0">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-lg leading-snug text-[#2e2b27]">{benefit.title}</h3>
              <p className="text-sm leading-relaxed text-[#766e64]">{benefit.description}</p>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}