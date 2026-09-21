import Link from 'next/link';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="border-b border-gold/15 bg-ink-soft">
        <div className="container-x flex items-center justify-between gap-4 py-5">
          <Link href="/admin" className="font-display text-xl text-gold">
            EZAKI Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm text-cream/70">
            <Link href="/admin/products" className="hover:text-gold-light">
              Produits
            </Link>
            <Link href="/parfums" className="hover:text-gold-light">
              Boutique
            </Link>
            <AdminLogoutButton />
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
