'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { createProduct } from '../actions';

const initialValues = {
  name: '',
  price: 0,
  old_price: null as number | null,
  category: 'Non classe',
  badge: '',
  in_stock: true,
  published: false,
  arabic: '',
  tagline: '',
  short_description: '',
  description: '',
  family: 'Non renseignee',
  concentration: 'Non renseignee',
  size: 'Non renseignee',
  notes_top: '',
  notes_heart: '',
  notes_base: '',
  longevity: 'Non renseignee',
  intensity: 'Non renseignee',
  featured: false,
  accent: '#C9A227',
};

function listValue(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export default function ProductCreator() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  function update(field: keyof typeof values, value: string | number | boolean | null) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    const result = await createProduct(
      {
        ...values,
        name: values.name.trim(),
        badge: values.badge.trim() || null,
        notes_top: listValue(values.notes_top),
        notes_heart: listValue(values.notes_heart),
        notes_base: listValue(values.notes_base),
      },
      image,
    );
    setSaving(false);
    if (!result.ok) {
      setMessage(result.error ?? 'Erreur lors de la création.');
      return;
    }
    router.push(`/admin/products/${result.id}`);
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-4 rounded-2xl border border-gold/15 bg-ink-soft p-6">
        {([
          ['name', 'Nom'],
          ['price', 'Prix'],
          ['old_price', 'Ancien prix'],
          ['category', 'Catégorie'],
          ['badge', 'Badge'],
          ['arabic', 'Nom arabe'],
          ['tagline', 'Accroche'],
          ['short_description', 'Description courte'],
          ['description', 'Description'],
          ['family', 'Famille'],
          ['concentration', 'Concentration'],
          ['size', 'Taille'],
          ['notes_top', 'Notes de tête (séparées par des virgules)'],
          ['notes_heart', 'Notes de cœur (séparées par des virgules)'],
          ['notes_base', 'Notes de fond (séparées par des virgules)'],
          ['longevity', 'Tenue'],
          ['intensity', 'Intensité'],
          ['accent', 'Accent'],
        ] as const).map(([field, label]) => (
          <label key={field}>
            {label}
            <input
              className="field"
              type={field === 'price' || field === 'old_price' ? 'number' : 'text'}
              min={field === 'price' || field === 'old_price' ? '0' : undefined}
              step={field === 'price' || field === 'old_price' ? '0.01' : undefined}
              value={values[field] ?? ''}
              onChange={(event) =>
                update(
                  field,
                  field === 'price' || field === 'old_price'
                    ? event.target.value === '' ? null : Number(event.target.value)
                    : event.target.value,
                )
              }
              required={field === 'name' || field === 'price' || field === 'category'}
            />
          </label>
        ))}

        <label className="flex gap-2"><input type="checkbox" checked={values.in_stock} onChange={(e) => update('in_stock', e.target.checked)} /> En stock</label>
        <label className="flex gap-2"><input type="checkbox" checked={values.published} onChange={(e) => update('published', e.target.checked)} /> Publié</label>
        <label className="flex gap-2"><input type="checkbox" checked={values.featured} onChange={(e) => update('featured', e.target.checked)} /> Mis en avant</label>

        {message ? <p className="text-sm text-red-200">{message}</p> : null}
        <button disabled={saving} className="btn-gold px-5 py-3">
          {saving ? 'Création…' : 'Créer le produit'}
        </button>
      </div>

      <div className="rounded-2xl border border-gold/15 bg-ink-soft p-6">
        <p className="mb-3 text-sm text-cream/60">Image obligatoire</p>
        {preview ? <img src={preview} alt={values.name} className="aspect-square w-full rounded-xl object-cover" /> : null}
        <input
          className="mt-4 block w-full text-sm"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={selectImage}
          required
        />
      </div>
    </form>
  );
}
