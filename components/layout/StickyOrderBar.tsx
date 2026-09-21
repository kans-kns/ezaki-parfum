import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { site } from '@/lib/site';
import { buildWhatsAppUrl, generalOrderMessage } from '@/lib/whatsapp';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

/**
 * Barre de conversion fixe en bas d'ecran sur mobile :
 * la majorite des clientes arrivent depuis Instagram, l'action WhatsApp
 * doit rester accessible en permanence.
 */
export default function StickyOrderBar() {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e1d7c8] bg-[#f7f4ee]/95 px-4 py-3 shadow-[0_-12px_30px_-24px_rgba(27,26,24,0.5)] backdrop-blur-lg sm:hidden">
        <div className="flex items-center gap-3">
          <Link href="/parfums" className="btn-outline flex-1 px-4 py-2.5 text-xs">
            Voir les parfums
          </Link>
          <a
            href={buildWhatsAppUrl(generalOrderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold flex-[1.4] px-4 py-2.5 text-xs"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Commander
          </a>
        </div>
        <p className="mt-2 text-center text-[0.65rem] tracking-wide text-[#81786d]">
          {site.freeDelivery}
        </p>
      </div>

      {/* Bouton flottant sur tablette et desktop */}
      <a
        href={buildWhatsAppUrl(generalOrderMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Commander sur WhatsApp au ${site.phone}`}
        className="group fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full border border-[#d8cdbd] bg-white/95 py-3 pl-3 pr-4 shadow-[0_18px_45px_-30px_rgba(27,26,24,0.5)] backdrop-blur transition-all duration-300 ease-luxe hover:border-[#9a7634] sm:flex"
      >
        <span className="relative grid h-10 w-10 place-items-center rounded-full bg-[#e9dcc5] text-[#4a3d2d]">
          <WhatsAppIcon className="h-5 w-5" />
          <span
            className="absolute inset-0 rounded-full bg-[#cdbb9d]/30 blur-md"
            aria-hidden="true"
          />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#81786d]">
            Commande rapide
          </span>
          <span className="text-sm font-medium text-[#3b3732] group-hover:text-[#80612d]">
            {site.phone}
          </span>
        </span>
        <Sparkles className="h-4 w-4 text-gold/70" aria-hidden="true" />
      </a>
    </>
  );
}