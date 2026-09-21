import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-admin';
import ProductEditor from './ProductEditor';

export default async function AdminProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, old_price, in_stock, published, badge, category, image_path')
    .eq('id', id)
    .single();

  if (error || !data) notFound();

  const { data: image } = data.image_path
    ? supabase.storage.from('product-images').getPublicUrl(data.image_path)
    : { data: null };

  return (
    <main className="container-x py-10 sm:py-14">
      <p className="eyebrow text-gold">Produit</p>
      <h1 className="mt-3 font-display text-4xl">{data.name}</h1>
      <ProductEditor
        product={{
          ...data,
          image_url: image?.publicUrl ?? null,
        }}
      />
    </main>
  );
}
