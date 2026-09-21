'use client';

import { useState } from 'react';
import { Send, User } from 'lucide-react';
import type { Product } from '@/lib/products';
import { formatPrice } from '@/lib/format';
import { buildWhatsAppUrl, formOrderMessage } from '@/lib/whatsapp';
import { site } from '@/lib/site';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

const initialValues = {
  fullName: '',
  phone: '',
  city: '',
  product: '',
  quantity: 1,
  note: '',
};

/**
 * Formulaire de commande : les informations saisies sont transformees
 * en message WhatsApp pre-rempli (aucune donnee envoyee a un serveur).
 */
export default function OrderForm({ products }: { products: Product[] }) {
  const [values, setValues] = useState({
    ...initialValues,
    product: products[0]?.slug ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof typeof initialValues, value: string | number) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (values.fullName.trim().length < 3) next.fullName = 'Merci d\u2019indiquer votre nom complet.';
    if (!/^[0-9+\s]{9,15}$/.test(values.phone.trim())) {
      next.phone = 'Numéro de téléphone invalide (ex : 0654117023).';
    }
    if (values.city.trim().length < 2) next.city = 'Merci d\u2019indiquer votre ville.';
    if (!selectedProduct) next.product = 'Merci de sélectionner un parfum disponible.';
    if (selectedProduct && !selectedProduct.inStock) {
      next.product = 'Ce parfum est momentanément indisponible.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const href = buildWhatsAppUrl(
      formOrderMessage({
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        city: values.city.trim(),
        product: selectedProduct?.name ?? values.product,
        quantity: values.quantity,
        note: values.note.trim() || undefined,
      }),
    );

    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const selectedProduct = products.find((product) => product.slug === values.product);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-[#766e64]">Nom complet *</span>
          <input
            type="text"
            name="fullName"
            autoComplete="name"
            value={values.fullName}
            onChange={(event) => update('fullName', event.target.value)}
            placeholder="Ex : Salma Bennani"
            aria-invalid={Boolean(errors.fullName)}
            className="w-full rounded-2xl border border-[#e1d7c8] bg-[#f7f4ee] px-4 py-3 text-sm text-[#3b3732] transition-colors placeholder:text-[#9a9188] focus:border-[#9a7634] focus:outline-none"
            required
          />
          {errors.fullName ? (
            <span className="text-xs text-gold-light">{errors.fullName}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-[#766e64]">Téléphone *</span>
          <input
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => update('phone', event.target.value)}
            placeholder="Ex : 0654117023"
            aria-invalid={Boolean(errors.phone)}
            className="w-full rounded-2xl border border-[#e1d7c8] bg-[#f7f4ee] px-4 py-3 text-sm text-[#3b3732] transition-colors placeholder:text-[#9a9188] focus:border-[#9a7634] focus:outline-none"
            required
          />
          {errors.phone ? <span className="text-xs text-gold-light">{errors.phone}</span> : null}
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-[#766e64]">Ville *</span>
          <input
            type="text"
            name="city"
            autoComplete="address-level2"
            value={values.city}
            onChange={(event) => update('city', event.target.value)}
            placeholder="Ex : Casablanca"
            aria-invalid={Boolean(errors.city)}
            className="w-full rounded-2xl border border-[#e1d7c8] bg-[#f7f4ee] px-4 py-3 text-sm text-[#3b3732] transition-colors placeholder:text-[#9a9188] focus:border-[#9a7634] focus:outline-none"
            required
          />
          {errors.city ? <span className="text-xs text-gold-light">{errors.city}</span> : null}
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-[#766e64]">Parfum souhaité</span>
          <select
            name="product"
            value={values.product}
            onChange={(event) => update('product', event.target.value)}
            className="w-full rounded-2xl border border-[#e1d7c8] bg-[#f7f4ee] px-4 py-3 text-sm text-[#3b3732] transition-colors placeholder:text-[#9a9188] focus:border-[#9a7634] focus:outline-none"
          >
            {products.map((product) => (
              <option key={product.slug} value={product.slug} disabled={!product.inStock}>
                {product.name} — {formatPrice(product.price)}
              </option>
            ))}
          </select>
          {errors.product ? <span className="text-xs text-gold-light">{errors.product}</span> : null}
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-[#766e64]">Quantité</span>
          <input
            type="number"
            name="quantity"
            min={1}
            max={20}
            value={values.quantity}
            onChange={(event) => update('quantity', Number(event.target.value) || 1)}
            className="w-full rounded-2xl border border-[#e1d7c8] bg-[#f7f4ee] px-4 py-3 text-sm text-[#3b3732] transition-colors placeholder:text-[#9a9188] focus:border-[#9a7634] focus:outline-none"
          />
        </label>

        <p className="flex items-end text-xs text-[#81786d]">
          {selectedProduct
            ? `Total estimé : ${formatPrice(selectedProduct.price * values.quantity)} — ${site.freeDelivery}.`
            : site.freeDelivery}
        </p>
      </div>
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-[#766e64]">Remarque (optionnel)</span>
        <textarea
          name="note"
          rows={3}
          value={values.note}
          onChange={(event) => update('note', event.target.value)}
          placeholder="Adresse exacte, horaire de livraison, emballage cadeau…"
          className="w-full resize-none rounded-2xl border border-[#e1d7c8] bg-[#f7f4ee] px-4 py-3 text-sm text-[#3b3732] transition-colors placeholder:text-[#9a9188] focus:border-[#9a7634] focus:outline-none"
        />
      </label>

      <button type="submit" className="btn-gold px-7 py-3.5">
        <WhatsAppIcon className="h-5 w-5" />
        Envoyer ma commande sur WhatsApp
        <Send className="h-4 w-4" aria-hidden="true" />
      </button>

      <p className="flex items-start gap-2 text-xs text-[#9a9188]">
        <User className="mt-0.5 h-4 w-4 shrink-0 text-[#9a7634]" aria-hidden="true" />
        Vos informations restent sur votre appareil : elles sont simplement insérées dans le
        message WhatsApp avant l’envoi. Aucun paiement en ligne n’est demandé.
      </p>
    </form>
  );
}