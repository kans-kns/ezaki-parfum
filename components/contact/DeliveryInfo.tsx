import Reveal from '@/components/ui/Reveal';

const items = [
  {
    eyebrow: 'Livraison',
    title: 'Partout au Maroc, sans frais',
    text: "Nous expédions votre parfum sous 24h. Comptez 24 à 72h selon votre ville, avec un suivi par WhatsApp jusqu'à la réception.",
  },
  {
    eyebrow: 'Paiement',
    title: 'À la livraison, en espèces',
    text: "Vous ne payez qu'une fois le colis en main. Aucun acompte, aucune carte bancaire, aucun risque.",
  },
  {
    eyebrow: 'Emballage',
    title: 'Présentation soignée',
    text: 'Chaque flacon est protégé et présenté dans un emballage élégant, prêt à offrir en cadeau.',
  },
];

/** Informations pratiques : livraison, paiement, emballage. */
export default function DeliveryInfo() {
  return (
    <section id="livraison" className="container-x pb-12 sm:pb-16">
      <Reveal className="grid gap-6 rounded-[2rem] border border-[#e1d7c8] bg-white p-6 shadow-[0_18px_45px_-38px_rgba(27,26,24,0.4)] sm:p-8 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.eyebrow} className="flex flex-col gap-2">
            <p className="eyebrow">{item.eyebrow}</p>
            <h2 className="font-display text-xl">{item.title}</h2>
            <p className="text-sm leading-relaxed text-[#766e64]">{item.text}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}