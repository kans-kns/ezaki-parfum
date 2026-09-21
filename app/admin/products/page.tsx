import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-admin';

export default async function AdminProductsPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, image_path, in_stock, published')
    .order('updated_at', { ascending: false });

  const products = data ?? [];

  return (
    <main className="container-x py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold">Catalogue</p>
          <h1 className="mt-3 font-display text-4xl">Produits</h1>
        </div>
        <Link href="/admin/products/new" className="btn-gold px-5 py-3">
          Ajouter un produit
        </Link>
      </div>

      {error ? (
        <p className="mt-8 rounded-2xl border border-red-400/30 bg-red-950/20 p-4 text-sm text-red-200">
          La table Supabase n’est pas encore disponible. Exécutez les migrations fournies dans
          <code className="mx-1">supabase/migrations/001_products.sql</code>.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-gold/15 bg-ink-soft">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-gold/15 text-cream/50">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Produit</th>
                <th className="p-4">Prix</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const imageUrl =
                  product.image_path
                    ? supabase.storage.from('product-images').getPublicUrl(product.image_path).data.publicUrl
                    : null;

                return (
                  <tr key={product.id} className="border-b border-gold/10 last:border-0">
                    <td className="p-4">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt=""
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-cream/40">Aucune image</span>
                      )}
                    </td>
                    <td className="p-4">{product.name}</td>
                    <td className="p-4 text-gold">{product.price} DH</td>
                    <td className="p-4">{product.in_stock ? 'En stock' : 'Rupture'}</td>
                    <td className="p-4">{product.published ? 'Publié' : 'Masqué'}</td>
                    <td className="p-4">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-gold-light hover:underline"
                      >
                        Modifier
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
