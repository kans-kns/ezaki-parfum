import { requireAdmin } from '@/lib/auth/require-admin';
import ProductCreator from './ProductCreator';

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <main className="container-x py-10 sm:py-14">
      <p className="eyebrow text-gold">Produit</p>
      <h1 className="mt-3 font-display text-4xl">Nouveau produit</h1>
      <ProductCreator />
    </main>
  );
}
