import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-admin';

export default async function AdminPage() {
  const { supabase } = await requireAdmin();
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  return (
    <main className="container-x py-10 sm:py-14">
      <p className="eyebrow text-gold">Tableau de bord</p>
      <h1 className="mt-3 font-display text-4xl">Gestion EZAKI</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gold/15 bg-ink-soft p-5">
          <p className="text-sm text-cream/55">Produits dans Supabase</p>
          <p className="mt-2 font-display text-3xl text-gold">{count ?? 0}</p>
        </div>
      </div>
      <Link href="/admin/products" className="btn-gold mt-8 inline-flex px-5 py-3">
        Gérer les produits
      </Link>
    </main>
  );
}
