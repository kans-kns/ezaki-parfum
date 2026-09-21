import { ChevronRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const faq = [
  {
    question: 'Comment passer commande ?',
    answer:
      "Ajoutez vos parfums au panier ou cliquez sur « Commander sur WhatsApp ». Le message est déjà rédigé : il vous reste seulement à l'envoyer, nous confirmons votre commande dans les minutes qui suivent.",
  },
  {
    question: 'La livraison est-elle vraiment gratuite ?',
    answer:
      "Oui. La livraison est gratuite dans toutes les villes du Maroc, sans minimum d'achat. Les commandes sont expédiées sous 24h et livrées généralement en 24 à 72h.",
  },
  {
    question: 'Quand et comment je paie ?',
    answer:
      "Vous payez à la livraison, en espèces, directement au livreur. Aucun acompte ni paiement en ligne n'est demandé.",
  },
  {
    question: 'Puis-je échanger un parfum ?',
    answer:
      "Si le flacon est encore scellé, contactez-nous sur WhatsApp dans les 48h suivant la réception : nous organisons l'échange ou le retour.",
  },
  {
    question: 'Proposez-vous des coffrets cadeaux ?',
    answer:
      "Oui, nous préparons des emballages cadeaux soignés, avec un ruban doré et une carte. Mentionnez-le simplement dans votre message WhatsApp.",
  },
];

/** Questions frequentes : rassure avant la commande. */
export default function FaqSection() {
  return (
    <section id="faq" className="container-x pb-16 sm:pb-20">
      <Reveal className="flex flex-col items-center gap-3 text-center">
        <p className="eyebrow">Questions fréquentes</p>
        <h2 className="text-3xl sm:text-4xl">
          Tout ce qu’il faut <span className="text-[#9a7634]">savoir</span>
        </h2>
        <span className="hairline max-w-[120px]" aria-hidden="true" />
      </Reveal>

      <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3">
        {faq.map((item, index) => (
          <Reveal key={item.question} delay={index * 70}>
            <details className="group rounded-2xl border border-[#e7e0d4] bg-white px-5 py-4 transition-colors open:border-[#cdbb9d]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-[#2e2b27]">
                {item.question}
                <ChevronRight
                  className="h-5 w-5 shrink-0 text-[#9a7634] transition-transform duration-300 group-open:rotate-90"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#766e64]">{item.answer}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}