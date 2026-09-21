'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProduct } from '../actions';

type Product = {
  id: string;
  name: string;
  price: number;
  old_price: number | null;
  in_stock: boolean;
  published: boolean;
  badge: string | null;
  category: string;
  image_url: string | null;
};

export default function ProductEditor({ product }: { product: Product }) {
  const router = useRouter();
  const [values, setValues] = useState(product);
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState(product.image_url);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function selectImage(file?: File) {
    if (!file) return;
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    const result = await updateProduct(
      product.id,
      {
        name: values.name.trim(),
        price: Number(values.price),
        old_price: values.old_price === null ? null : Number(values.old_price),
        in_stock: values.in_stock,
        published: values.published,
        badge: values.badge?.trim() || null,
        category: values.category.trim(),
      },
      image,
    );

    setSaving(false);
    setMessage(result.ok ? 'Produit enregistré.' : result.error ?? 'Erreur lors de l’enregistrement.');

    if (result.ok) {
      setImage(undefined);
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-4 rounded-2xl border border-gold/15 bg-ink-soft p-6">
        <label>Nom<input className="field" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} required /></label>
        <label>Prix<input className="field" type="number" min="0" step="0.01" value={values.price} onChange={(e) => setValues({ ...values, price: Number(e.target.value) })} required /></label>
        <label>Ancien prix<input className="field" type="number" min="0" step="0.01" value={values.old_price ?? ''} onChange={(e) => setValues({ ...values, old_price: e.target.value === '' ? null : Number(e.target.value) })} /></label>
        <label>Badge<input className="field" value={values.badge ?? ''} onChange={(e) => setValues({ ...values, badge: e.target.value })} /></label>
        <label>Catégorie<input className="field" value={values.category} onChange={(e) => setValues({ ...values, category: e.target.value })} /></label>

        <label className="flex gap-2">
          <input type="checkbox" checked={values.in_stock} onChange={(e) => setValues({ ...values, in_stock: e.target.checked })} />
          En stock
        </label>
        <label className="flex gap-2">
          <input type="checkbox" checked={values.published} onChange={(e) => setValues({ ...values, published: e.target.checked })} />
          Publié
        </label>

        {message ? <p className="text-sm text-cream/70">{message}</p> : null}

        <button disabled={saving} className="btn-gold px-5 py-3">
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>

      <div className="rounded-2xl border border-gold/15 bg-ink-soft p-6">
        <p className="mb-3 text-sm text-cream/60">Image</p>
        {preview ? <img src={preview} alt={values.name} className="aspect-square w-full rounded-xl object-cover" /> : null}
        <input
          className="mt-4 block w-full text-sm"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={(e) => selectImage(e.target.files?.[0])}
        />
      </div>
    </form>
  );
}
