'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navLinks, site } from '@/lib/site';
import { buildWhatsAppUrl, generalOrderMessage } from '@/lib/whatsapp';
import Logo from '@/components/ui/Logo';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import CartButton from '@/components/cart/CartButton';

/** En-tete du site : transparent en haut de page, opaque et floute au scroll. */
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Ferme le menu mobile a chaque changement de page
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const whatsappHref = buildWhatsAppUrl(generalOrderMessage);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.split('#')[0]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b text-[#2e2b27] transition-all duration-500 ease-luxe luxury-nav',
        scrolled
          ? 'backdrop-blur-lg'
          : 'bg-[#f7f4ee]/90',
      )}
    >
      {/* Bandeau annonce */}
      <div className="hidden border-b border-[#e7e0d4] bg-white/70 py-1.5 md:block">
        <div className="container-x flex items-center justify-between text-[0.7rem] tracking-wide text-[#6c665d]">
          <p className="flex items-center gap-2">
            <span className="text-[#9a7634]" aria-hidden="true">
              ✦
            </span>
            {site.freeDelivery}
          </p>
          <p className="flex items-center gap-4">
            <span className="hidden lg:inline">{site.qualityLine}</span>
            <a href={site.phoneHref} className="link-underline flex items-center gap-1.5 text-[#80612d]">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {site.phone}
            </a>
          </p>
        </div>
      </div>

      <div className="container-x flex min-h-[4.5rem] items-center justify-between gap-3 py-3">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-active={isActive(link.href)}
              className={cn(
                'luxury-nav-link',
              )}
            >
              {link.label}
              {isActive(link.href) ? (
                <span
                  className="absolute inset-x-3 -bottom-0.5 h-px bg-[#9a7634]"
                  aria-hidden="true"
                />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Nous contacter sur WhatsApp"
            className="luxury-icon-button hidden sm:grid"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>

          <CartButton />

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold hidden px-5 py-2.5 text-xs sm:inline-flex md:text-sm"
          >
            Commander
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="luxury-icon-button lg:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        className={cn(
          'overflow-hidden border-[#e7e0d4] bg-[#f7f4ee]/98 backdrop-blur-lg transition-[max-height,opacity] duration-500 ease-luxe lg:hidden',
          menuOpen ? 'max-h-[520px] border-t opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav aria-label="Navigation mobile" className="container-x flex flex-col py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'border-b border-[#e7e0d4] py-3.5 font-display text-lg transition-colors',
                isActive(link.href) ? 'text-[#80612d]' : 'text-[#2e2b27] hover:text-[#80612d]',
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-4 flex flex-col gap-3 pb-4">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-gold">
              <WhatsAppIcon className="h-5 w-5" />
              Commander sur WhatsApp
            </a>
            <a href={site.phoneHref} className="btn-outline">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {site.phone}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}