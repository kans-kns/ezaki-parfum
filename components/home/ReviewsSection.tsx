import { Quote, Star } from 'lucide-react';
import { reviews, brandStats } from '@/lib/content';
import { site } from '@/lib/site';
import Reveal from '@/components/ui/Reveal';
import StarRating from '@/components/ui/StarRating';

/** Avis clients : preuve sociale elegante, defilement horizontal sur mobile. */
export default function ReviewsSection() {
  return (
    <section id="avis" className="relative py-16 sm:py-20" aria-labelledby="avis-title">
      <div className="container-x">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <p className="eyebrow">Ils nous font confiance</p>
          <h2 id="avis-title" className="text-3xl sm:text-4xl">
            Avis <span className="text-[#9a7634]">clients</span>
          </h2>
          <span className="hairline max-w-[120px]" aria-hidden="true" />

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <span className="flex items-center gap-2 text-sm text-[#766e64]">
              <StarRating rating={4.9} />
              <span className="text-[#9a9188]">note moyenne</span>
            </span>
            <span className="hidden text-gold/40 sm:inline" aria-hidden="true">
              •
            </span>
            <span className="text-sm text-[#766e64]">
              {brandStats[1].value} clients suivent la marque
            </span>
            <span className="hidden text-gold/40 sm:inline" aria-hidden="true">
              •
            </span>
            <span className="flex items-center gap-2 text-sm text-[#766e64]">
              <Star className="h-4 w-4 fill-[#9a7634] text-[#9a7634]" aria-hidden="true" />
              Satisfait ou conseillé
            </span>
          </div>
        </Reveal>
      </div>

      <div className="mt-10">
        <ul className="no-scrollbar container-x flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal
              key={`${review.author}-${review.city}`}
              as="li"
              delay={(index % 3) * 90}
              className="w-[80vw] shrink-0 snap-center sm:w-auto"
            >
              <figure className="flex h-full flex-col gap-4 rounded-3xl border border-[#e7e0d4] bg-white p-6 shadow-[0_18px_45px_-38px_rgba(27,26,24,0.4)] transition-colors duration-500 hover:border-[#cdbb9d]">
                <Quote className="h-6 w-6 text-[#9a7634]/70" aria-hidden="true" />
                <blockquote className="font-display text-lg leading-relaxed text-[#3b3732]">
                  « {review.quote} »
                </blockquote>
                <StarRating rating={review.rating} className="mt-auto" />
                <figcaption className="border-t border-[#e7e0d4] pt-3 text-sm">
                  <span className="text-[#3b3732]">— {review.author}</span>
                  <span className="block text-xs text-[#9a9188]">
                    {review.city}
                    {review.product ? ` • ${review.product}` : ''}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>

      <p className="container-x mt-6 text-center text-xs text-[#9a9188]">
        Avis recueillis auprès de nos clients sur WhatsApp et Instagram ({site.instagramHandle}).
      </p>
    </section>
  );
}