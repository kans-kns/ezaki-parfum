import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const { loadEnvConfig } = nextEnv;
loadEnvConfig(root);
const bucket = 'product-images';
const generatedFile = join(root, 'lib', 'products.synced.generated.ts');
const sourceMapFile = join(root, 'lib', 'product-source-map.generated.json');
const storefrontFiles = [
  'lib/products.ts',
  'lib/products.synced.generated.ts',
  'lib/product-source-map.generated.json',
  'lib/images.ts',
];
const inputs = [
  ['aard-5-b', 'عرض 5 ب', '', 200, 'synced-aard-5-b.webp'],
  ['aard-4-b', 'عرض 4 ب', '', 180, 'synced-aard-4-b.webp'],
  ['aard', 'عرض 3 ب', '', 149, 'synced-aard.webp'],
  ['aard3-b', 'عرض3 ب', '', 149, 'synced-aard3-b.webp'],
  ['aard4-b', 'عرض4 ب', '', 180, 'synced-aard4-b.webp'],
  ['aard-5-b-1', 'عرض 5 ب', '', 200, 'synced-aard-5-b-1.webp'],
  ['may-way', 'May way', '', 50, 'synced-may-way.webp'],
  ['ber-bery-her', 'Ber bery her', '', 50, 'synced-ber-bery-her.webp'],
  ['prada-paradoux', 'Prada paradoux', '', 50, 'synced-prada-paradoux.webp'],
  ['eskada-taj', 'eskada taj', '', 50, 'synced-eskada-taj.webp'],
  ['le-beau', 'Le beau', 'المنتج الخامس', 50, 'synced-le-beau.webp'],
  ['1million', '1million', 'المنتج الثاني', 50, 'synced-1million.webp'],
  ['product-4', 'Lacoste noir', 'المنتج-الرابع', 50, 'synced-product-4.webp'],
  ['product-1', 'Diore homme', 'المنتج الأول', 50, 'synced-product-1.webp'],
  ['product-3', 'You intensely', 'المنتج الثالث', 50, 'synced-product-3.webp'],
];
const columns = 'id, legacy_id, slug, source_id, source_url, name, arabic, tagline, short_description, description, price, old_price, category, family, concentration, size, notes_top, notes_heart, notes_base, image_path, badge, rating, reviews_count, longevity, intensity, in_stock, featured, accent, published, created_at, updated_at';
const required = {
  arabic: '', tagline: '', short_description: '', old_price: null,
  category: 'Non classe', family: 'Non renseignee', concentration: 'Non renseignee',
  size: 'Non renseignee', notes_top: [], notes_heart: [], notes_base: [],
  badge: null, rating: 0, reviews_count: 0, longevity: 'Non renseignee',
  intensity: 'Non renseignee', in_stock: true, featured: true,
  accent: '#C9A227', published: true,
};

function fail(message) { throw new Error(`[migration] ${message}`); }
function equal(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function arrays(value) { return Array.isArray(value) ? value : value ?? []; }
function complete(row, expected) {
  return Object.keys(expected).every((key) =>
    equal(key.startsWith('notes_') ? arrays(row[key]) : row[key], expected[key]));
}
async function hash(file) { return createHash('sha256').update(await readFile(file)).digest('hex'); }
async function snapshot(files) {
  const result = new Map();
  for (const file of files) {
    const info = await stat(file).catch(() => null);
    if (!info?.isFile()) fail(`Required file is missing: ${file}`);
    result.set(file, { size: info.size, hash: await hash(file) });
  }
  return result;
}
async function unchanged(before) {
  for (const [file, value] of before) {
    const info = await stat(file);
    if (!equal(value, { size: info.size, hash: await hash(file) })) {
      fail(`File changed during migration: ${file}`);
    }
  }
}
function parseGenerated(source) {
  const pattern = /^\s*"([^"]+)":\s*\{\s*sourceId:\s*"([^"]+)",\s*sourceUrl:\s*"([^"]+)",\s*name:\s*"((?:[^"\\]|\\.)*)",\s*price:\s*([0-9]+(?:\.[0-9]+)?),\s*image:\s*"([^"]+)"\s*\},?$/gm;
  const result = new Map();
  for (const match of source.matchAll(pattern)) {
    if (result.has(match[1])) fail(`Duplicate generated slug: ${match[1]}`);
    result.set(match[1], {
      sourceId: match[2], sourceUrl: match[3],
      name: JSON.parse(`"${match[4]}"`), price: Number(match[5]), image: match[6],
    });
  }
  return result;
}
function manifestFromFiles(generated, sourceMap) {
  const parsed = parseGenerated(generated);
  if (parsed.size !== 15 || Object.keys(sourceMap).length !== 15) {
    fail(`Expected 15 generated products and source mappings.`);
  }
  const manifest = inputs.map(([slug, expectedName, description, expectedPrice, filename]) => {
    const entry = parsed.get(slug);
    const mappings = Object.entries(sourceMap).filter(([, value]) =>
      value.localId === slug && value.localSlug === slug);
    if (!entry) fail(`Missing generated entry: ${slug}`);
    if (mappings.length !== 1) fail(`Expected one source mapping for ${slug}; found ${mappings.length}`);
    if (entry.name !== expectedName || entry.price !== expectedPrice ||
        entry.image !== `/images/products/${filename}`) {
      fail(`Generated manifest mismatch: ${slug}`);
    }
    if (entry.sourceUrl !== mappings[0][0] || entry.sourceId !== mappings[0][1].sourceId) {
      fail(`Generated/source-map mismatch: ${slug}`);
    }
    return {
      ...required, legacy_id: slug, slug, source_id: entry.sourceId,
      source_url: entry.sourceUrl, name: entry.name, description,
      price: entry.price, image_path: `products/${filename}`,
    };
  });
  for (const field of ['legacy_id', 'slug', 'source_id', 'image_path']) {
    if (new Set(manifest.map((row) => row[field])).size !== 15) fail(`Duplicate ${field}`);
  }
  return manifest;
}
function localPath(row) { return join(root, 'public', 'images', 'products', row.image_path.slice(9)); }
async function object(path) {
  const slash = path.lastIndexOf('/');
  const { data, error } = await supabase.storage.from(bucket).list(path.slice(0, slash), { search: path.slice(slash + 1), limit: 100 });
  if (error) fail(`Storage inspection failed for ${path}: ${error.message}`);
  return data?.find((entry) => entry.name === path.slice(slash + 1)) ?? null;
}
async function remoteHash(path) {
  const { data, error } = await supabase.storage.from(bucket).download(path);
  if (error) fail(`Storage download failed for ${path}: ${error.message}`);
  return createHash('sha256').update(Buffer.from(await data.arrayBuffer())).digest('hex');
}
async function rows(manifest) {
  const slugs = manifest.map((row) => row.slug);
  const ids = manifest.map((row) => row.legacy_id);
  const a = await supabase.from('products').select(columns).in('slug', slugs);
  if (a.error) fail(`Product read failed: ${a.error.message}`);
  const b = await supabase.from('products').select(columns).in('legacy_id', ids);
  if (b.error) fail(`Product read failed: ${b.error.message}`);
  return [...new Map([...(a.data ?? []), ...(b.data ?? [])].map((row) => [row.id, row])).values()];
}
async function adminCheck() {
  const user = await supabase.auth.getUser();
  if (user.error || !user.data.user) fail(`Authenticated user check failed: ${user.error?.message ?? 'No user'}`);
  const admin = await supabase.from('admin_users').select('user_id, role')
    .eq('user_id', user.data.user.id).eq('role', 'admin').maybeSingle();
  if (admin.error) fail(`Admin check failed: ${admin.error.message}`);
  if (!admin.data || admin.data.role !== 'admin') fail('Authenticated user is not a public.admin_users admin');
}
async function preflight(manifest) {
  await adminCheck();
  const files = [...storefrontFiles.map((file) => join(root, file)), ...manifest.map(localPath)];
  const before = await snapshot(files);
  for (const row of manifest) {
    const info = await stat(localPath(row)).catch(() => null);
    if (!info?.isFile() || info.size === 0) fail(`Missing local image: ${localPath(row)}`);
  }
  const storage = [];
  for (const row of manifest) {
    const existing = await object(row.image_path);
    if (existing) {
      if (await hash(localPath(row)) !== await remoteHash(row.image_path)) fail(`Conflicting Storage object: ${row.image_path}`);
      storage.push(true);
    } else storage.push(false);
  }
  const existingRows = await rows(manifest);
  if (existingRows.length !== 0 && existingRows.length !== 15) fail(`Partial DB state: ${existingRows.length} rows`);
  if (existingRows.length === 15) {
    for (const row of manifest) {
      const match = existingRows.filter((item) => item.slug === row.slug || item.legacy_id === row.legacy_id);
      if (match.length !== 1 || !complete(match[0], row)) fail(`Conflicting DB row: ${row.slug}`);
    }
    if (storage.some((value) => !value)) fail('Database complete but Storage incomplete');
    return { before, existingRows, storage, already: true };
  }
  if (storage.some(Boolean)) fail('Storage partial state exists while database rows are absent');
  return { before, existingRows: [], storage, already: false };
}
async function rollbackDb(inserted) {
  if (inserted.length) {
    const result = await supabase.from('products').delete().in('id', inserted.map((row) => row.id));
    if (result.error) console.error(`[migration] Database rollback failed: ${result.error.message}`);
  }
}
async function rollbackStorage(uploaded) {
  if (uploaded.length) {
    const result = await supabase.storage.from(bucket).remove(uploaded);
    if (result.error) console.error(`[migration] Storage rollback failed: ${result.error.message}`);
  }
}
async function verify(manifest, finalRows, before) {
  if (finalRows.length !== 15 || new Set(finalRows.map((row) => row.id)).size !== 15 ||
      new Set(finalRows.map((row) => row.legacy_id)).size !== 15 ||
      new Set(finalRows.map((row) => row.slug)).size !== 15) fail('Final row count or uniqueness verification failed');
  for (const expected of manifest) {
    const row = finalRows.find((item) => item.slug === expected.slug);
    if (!row || !complete(row, expected)) fail(`Final field mismatch: ${expected.slug}`);
    if (!await object(expected.image_path)) fail(`Missing Storage object: ${expected.image_path}`);
    if (await hash(localPath(expected)) !== await remoteHash(expected.image_path)) fail(`Image hash mismatch: ${expected.slug}`);
  }
  const audit = await supabase.from('product_audit_log').select('product_id, action')
    .in('product_id', finalRows.map((row) => row.id));
  if (audit.error) fail(`Audit read failed: ${audit.error.message}`);
  const inserts = (audit.data ?? []).filter((row) => row.action === 'insert');
  if (inserts.length !== 15) fail(`Expected 15 audit inserts; found ${inserts.length}`);
  await unchanged(before);
  return { databaseRows: 15, storageObjects: 15, auditInsertEvents: 15, completeApprovedFields: true, imagePathsMatch: true, uniqueUUIDs: true, uniqueLegacyIds: true, uniqueSlugs: true, localImagesUnchanged: true, storefrontFilesUnchanged: true };
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anonKey) fail('Missing Supabase public configuration');
let supabase;

async function initializeSupabase() {
  const authToken = process.env.SUPABASE_AUTH_ACCESS_TOKEN;
  if (authToken) {
    supabase = createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${authToken}` } },
    });
    return;
  }

  const email = process.env.EZAKI_ADMIN_EMAIL;
  const password = process.env.EZAKI_ADMIN_PASSWORD;
  if (!email || !password) fail('Missing SUPABASE_AUTH_ACCESS_TOKEN');

  const authClient = createClient(url, anonKey);
  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session?.access_token) {
    console.error(
      `Auth sign-in failed: ${error?.message ?? 'no session returned'} ` +
      `(code: ${error?.code ?? 'unavailable'}, status: ${error?.status ?? 'unavailable'})`,
    );
    process.exitCode = 1;
    return;
  }

  supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${data.session.access_token}` } },
  });
}

async function main() {
  await initializeSupabase();
  if (!supabase) return;
  const generated = await readFile(generatedFile, 'utf8');
  const sourceMap = JSON.parse(await readFile(sourceMapFile, 'utf8'));
  const manifest = manifestFromFiles(generated, sourceMap);
  const state = await preflight(manifest);
  if (state.already) {
    console.log(JSON.stringify({ status: 'already-migrated', rowsInserted: 0, imagesUploaded: 0, verification: await verify(manifest, state.existingRows, state.before), warnings: [] }, null, 2));
    return;
  }
  const uploaded = [];
  let inserted = [];
  try {
    for (const row of manifest) {
      const result = await supabase.storage.from(bucket).upload(row.image_path, await readFile(localPath(row)), { contentType: 'image/webp', cacheControl: '31536000', upsert: false });
      if (result.error) fail(`Upload failed for ${row.image_path}: ${result.error.message}`);
      uploaded.push(row.image_path);
    }
    const result = await supabase.from('products').insert(manifest).select(columns);
    if (result.error || !result.data || result.data.length !== 15) fail(`Database insert failed: ${result.error?.message ?? 'wrong row count'}`);
    inserted = result.data;
    console.log(JSON.stringify({ status: 'migrated', rowsInserted: 15, imagesUploaded: 15, verification: await verify(manifest, inserted, state.before), warnings: [] }, null, 2));
  } catch (error) {
    await rollbackDb(inserted);
    await rollbackStorage(uploaded);
    throw error;
  }
}
main().catch((error) => { console.error(error instanceof Error ? error.message : '[migration] Migration failed'); process.exitCode = 1; });
