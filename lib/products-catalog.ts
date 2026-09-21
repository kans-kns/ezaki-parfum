import { products as localProducts, type Product, type ProductCategory } from './products';
import { createClient } from './supabase/server';
import type { SupabaseProduct } from './supabase/database.types';

const productCategories = new Set<ProductCategory>(['Homme', 'Femme', 'Mixte', 'Non classe']);

function mapCategory(category: string): ProductCategory {
  return productCategories.has(category as ProductCategory)
    ? (category as ProductCategory)
    : 'Non classe';
}

function mapProduct(row: SupabaseProduct, localProduct?: Product, image?: string): Product {
  return {
    id: row.id,
    slug: row.slug,
    sourceId: row.source_id ?? undefined,
    sourceUrl: row.source_url ?? undefined,
    name: row.name,
    arabic: row.arabic,
    tagline: row.tagline,
    shortDescription: row.short_description,
    description: row.description,
    price: row.price,
    oldPrice: row.old_price ?? undefined,
    category: mapCategory(row.category),
    family: row.family,
    concentration: row.concentration,
    size: row.size,
    notes: {
      top: row.notes_top,
      heart: row.notes_heart,
      base: row.notes_base,
    },
    image: image ?? localProduct?.image ?? '',
    badge: row.badge ?? undefined,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    longevity: row.longevity,
    intensity: row.intensity,
    inStock: row.in_stock,
    featured: row.featured,
    accent: row.accent,
  };
}

export async function getPublicProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('published', true)
      .order('featured', { ascending: false })
      .order('name', { ascending: true });

    if (error) throw error;

    const rows = (data ?? []) as SupabaseProduct[];
    const localBySlug = new Map(localProducts.map((product) => [product.slug, product]));

    return rows.map((row) => {
      const localProduct = localBySlug.get(row.slug);
      const storageImage = row.image_path
        ? supabase.storage.from('product-images').getPublicUrl(row.image_path).data.publicUrl
        : undefined;

      return mapProduct(row, localProduct, storageImage);
    });
  } catch {
    return localProducts;
  }
}

export async function getPublicProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('published', true)
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return undefined;

    const row = data as SupabaseProduct;
    const localProduct = localProducts.find((product) => product.slug === row.slug);
    const storageImage = row.image_path
      ? supabase.storage.from('product-images').getPublicUrl(row.image_path).data.publicUrl
      : undefined;

    return mapProduct(row, localProduct, storageImage);
  } catch {
    return localProducts.find((product) => product.slug === slug);
  }
}
