/**
 * Charge le catalogue depuis lib/products.ts (evite de dupliquer les slugs).
 * Le fichier est du TypeScript : on extrait les slugs avec une expression
 * reguliere pour rester simple et sans dependance.
 */
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const photosDir = join(root, 'public', 'images', 'photos');
const productsDir = join(root, 'public', 'images', 'products');
const manifestFile = join(root, 'lib', 'photos.generated.ts');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

/** Cles editoriales acceptees en plus des parfums. */
const brandKeys = [
  'hero',
  'hero-mobile',
  'packaging',
  'lifestyle',
  'about',
  'og',
  'instagram-1',
  'instagram-2',
  'instagram-3',
  'instagram-4',
  'instagram-5',
  'instagram-6',
];

async function slugsFromCatalogue() {
  const source = await readFile(join(root, 'lib', 'products.ts'), 'utf8');
  const matches = [...source.matchAll(/^\s*slug:\s*'([^']+)'/gm)];
  return matches.map((match) => match[1]);
}

/** Retourne un dictionnaire nom de fichier (sans extension) -> chemin public. */
async function scanFolder(folder, urlPrefix) {
  const found = new Map();
  let entries = [];
  try {
    entries = await readdir(folder, { withFileTypes: true });
  } catch {
    await mkdir(folder, { recursive: true });
    return found;
  }

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const extension = extname(entry.name).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(extension)) continue;
    const key = entry.name.slice(0, -extension.length);
    if (found.has(key)) continue;
    found.set(key, `${urlPrefix}/${entry.name}`);
  }
  return found;
}

const slugs = await slugsFromCatalogue();
const photoFiles = await scanFolder(photosDir, '/images/photos');
const productFiles = await scanFolder(productsDir, '/images/products');

const manifest = {};

// 1) Photos editoriales
for (const key of brandKeys) {
  if (photoFiles.has(key)) manifest[key] = photoFiles.get(key);
}

// 2) Photos de parfums : public/images/products/<slug>.jpg prioritaire
for (const slug of slugs) {
  const photo = productFiles.get(slug) ?? photoFiles.get(slug);
  if (photo) manifest[`product.${slug}`] = photo;
}

const entries = Object.keys(manifest)
  .sort()
  .map((key) => `  '${key}': '${manifest[key]}',`)
  .join('\n');

const file = `/**
 * FICHIER GENERE AUTOMATIQUEMENT — ne pas modifier a la main.
 * Produit par \`npm run photos\` (scripts/sync-photos.mjs).
 *
 * Pour ajouter de vraies photos : deposez vos fichiers dans
 * public/images/photos/ puis relancez \`npm run photos\`.
 */

export const photoManifest: Record<string, string> = {
${entries}
};
`;

await writeFile(manifestFile, file, 'utf8');

const productCount = Object.keys(manifest).filter((key) => key.startsWith('product.')).length;
const brandCount = Object.keys(manifest).length - productCount;

console.log(
  `Photos detectees : ${Object.keys(manifest).length} (${productCount} parfum(s), ${brandCount} visuel(s) editorial/editoriaux)`,
);
if (Object.keys(manifest).length === 0) {
  console.log(
    'Aucune photo pour le moment — les visuels vectoriels EZAKI restent affiches.\n' +
      'Deposez vos photos dans public/images/photos/ (voir LISEZ-MOI.txt).',
  );
}