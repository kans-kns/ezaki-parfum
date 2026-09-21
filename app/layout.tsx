import type { Metadata, Viewport } from 'next';
import './globals.css';
import { site } from '@/lib/site';
import { CartProvider } from '@/components/cart/CartProvider';
import CartDrawer from '@/components/cart/CartDrawer';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyOrderBar from '@/components/layout/StickyOrderBar';
import { brandImage } from '@/lib/images';
import { getPublicProducts } from '@/lib/products-catalog';

export const metadata: Metadata = {
  title: {
    default: 'EZAKI Parfum | Parfums de Luxe au Maroc',
    template: '%s | EZAKI Parfum',
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'EZAKI Parfum',
    'parfum Maroc',
    'parfum de luxe Maroc',
    'eau de parfum',
    'parfum pas cher Maroc',
    'livraison gratuite Maroc',
    'parfum oud',
    'ezaki_parfum',
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  metadataBase: new URL('https://ezakiparfum.ma'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    url: '/',
    siteName: site.name,
    title: 'EZAKI Parfum | Parfums de Luxe au Maroc',
    description: site.description,
    images: [
      {
        url: brandImage('og', '/images/brand/ambience.svg'),
        width: 1200,
        height: 1200,
        alt: 'EZAKI Parfum — parfums de luxe au Maroc',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EZAKI Parfum | Parfums de Luxe au Maroc',
    description: site.description,
    images: [brandImage('og', '/images/brand/ambience.svg')],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/brand/logo-mark.svg',
    apple: '/images/brand/logo-mark.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#080808',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const products = await getPublicProducts();

  return (
    <html lang="fr">
      <head>
        <link
          rel="preload"
          href="/fonts/playfair-display.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen font-sans">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
        >
          Aller au contenu
        </a>

        <CartProvider products={products}>
          <Navbar />
          <main id="contenu">{children}</main>
          <Footer products={products} />
          <CartDrawer />
          <StickyOrderBar />
        </CartProvider>
      </body>
    </html>
  );
}