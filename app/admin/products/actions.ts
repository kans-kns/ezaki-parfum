'use server';

import { requireAdmin } from '@/lib/auth/require-admin';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'produit';
}

async function uniqueSlug(supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'], name: string) {
  const base = slugify(name);
  let slug = base;
  let suffix = 2;

  while (true) {
    const { data, error } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle();
    if (error) throw new Error(`Impossible de vérifier le slug : ${error.message}`);
    if (!data) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function updateProduct(
  id: string,
  values: {
    name: string;
    price: number;
    old_price: number | null;
    in_stock: boolean;
    published: boolean;
    badge: string | null;
    category: string;
  },
  image?: File,
) {
  const { supabase, role } = await requireAdmin();

  if (role !== 'admin') {
    return { ok: false, error: 'Accès administrateur requis.' };
  }

  let uploadedPath: string | null = null;

  if (image?.size) {
    if (!IMAGE_TYPES.has(image.type) || image.size > MAX_IMAGE_SIZE) {
      return { ok: false, error: 'Image invalide ou trop volumineuse.' };
    }

    const extension = image.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    uploadedPath = `products/${id}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(uploadedPath, image, {
        contentType: image.type,
        upsert: false,
      });

    if (error) {
      return { ok: false, error: `Échec de l’envoi de l’image : ${error.message}` };
    }
  }

  const { data: current, error: currentError } = await supabase
    .from('products')
    .select('image_path')
    .eq('id', id)
    .single();

  if (currentError || !current) {
    if (uploadedPath) await supabase.storage.from('product-images').remove([uploadedPath]);
    return { ok: false, error: 'Produit introuvable.' };
  }

  const update = {
    ...values,
    ...(uploadedPath ? { image_path: uploadedPath } : {}),
  };

  const { error: updateError } = await supabase
    .from('products')
    .update(update)
    .eq('id', id);

  if (updateError) {
    if (uploadedPath) await supabase.storage.from('product-images').remove([uploadedPath]);
    return { ok: false, error: updateError.message };
  }

  if (uploadedPath && current.image_path) {
    await supabase.storage.from('product-images').remove([current.image_path]);
  }

  return { ok: true };
}

export async function createProduct(
  values: {
    name: string;
    price: number;
    old_price: number | null;
    category: string;
    badge: string | null;
    in_stock: boolean;
    published: boolean;
    arabic: string;
    tagline: string;
    short_description: string;
    description: string;
    family: string;
    concentration: string;
    size: string;
    notes_top: string[];
    notes_heart: string[];
    notes_base: string[];
    longevity: string;
    intensity: string;
    featured: boolean;
    accent: string;
  },
  image?: File,
) {
  const { supabase, role } = await requireAdmin();

  if (role !== 'admin') return { ok: false, error: 'Accès administrateur requis.' };
  if (!values.name.trim() || !values.category.trim() || !Number.isFinite(values.price) || values.price < 0) {
    return { ok: false, error: 'Nom, prix et catégorie sont obligatoires.' };
  }
  if (!image?.size || !IMAGE_TYPES.has(image.type) || image.size > MAX_IMAGE_SIZE) {
    return { ok: false, error: 'Une image valide est obligatoire (5 Mo maximum).' };
  }

  const id = crypto.randomUUID();
  let uploadedPath: string | null = null;

  try {
    const slug = await uniqueSlug(supabase, values.name);
    const extension = EXTENSIONS[image.type] ?? 'jpg';
    uploadedPath = `products/${id}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(uploadedPath, image, { contentType: image.type, upsert: false });

    if (uploadError) return { ok: false, error: `Échec de l’envoi de l’image : ${uploadError.message}` };

    const { error: insertError } = await supabase.from('products').insert({
      id,
      legacy_id: null,
      slug,
      source_id: null,
      source_url: null,
      ...values,
      name: values.name.trim(),
      category: values.category.trim(),
      badge: values.badge?.trim() || null,
      image_path: uploadedPath,
    });

    if (insertError) throw new Error(insertError.message);
    return { ok: true, id };
  } catch (error) {
    if (uploadedPath) await supabase.storage.from('product-images').remove([uploadedPath]);
    return { ok: false, error: error instanceof Error ? error.message : 'Création impossible.' };
  }
}
