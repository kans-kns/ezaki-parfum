import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const storeUrl = process.env.EZAKI_STORE_URL ?? 'https://ezakiparfum.youcan.store/';
const allowedHosts = new Set(['ezakiparfum.youcan.store', 'cdn.youcan.shop']);
const productsDir = join(root, 'public', 'images', 'products');
const generatedCatalogFile = join(root, 'lib', 'products.synced.generated.ts');
const mappingFile = join(root, 'lib', 'product-source-map.generated.json');
const fallbackFile = join(root, 'lib', 'products.ts');
const maxImageBytes = 10 * 1024 * 1024;
const requestTimeoutMs = 15_000;

const imageExtensions = {
  'image/avif': '.avif',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

function fail(message) {
  throw new Error(`[sync-products] ${message}`);
}

function safeSlug(value) {
  const slug = value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
  return slug || 'product';
}

function sourceSlug(sourceUrl) {
  return new URL(sourceUrl).pathname.split('/').filter(Boolean).pop() ?? '';
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: 'error',
    signal: AbortSignal.timeout(requestTimeoutMs),
    headers: { 'user-agent': 'EZAKI-product-sync/1.0' },
  });
  if (!response.ok) fail(`${url} returned HTTP ${response.status}`);
  return response.text();
}

function parseJsonLd(html, sourceUrl) {
  const scripts = [
    ...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ];

  for (const match of scripts) {
    try {
      const value = JSON.parse(match[1].trim());
      const candidates = Array.isArray(value) ? value : [value];
      const product = candidates.find((entry) => entry?.['@type'] === 'Product');
      if (!product) continue;

      const image = Array.isArray(product.image) ? product.image[0] : product.image;
      const price = Number(product.offers?.price);
      if (typeof product.name !== 'string' || !product.name.trim()) {
        fail(`missing product name at ${sourceUrl}`);
      }
      if (!Number.isFinite(price) || price < 0) {
        fail(`invalid product price at ${sourceUrl}`);
      }
      if (typeof image !== 'string' || !image) {
        fail(`missing product image at ${sourceUrl}`);
      }

      const imageUrl = new URL(image, sourceUrl);
      if (imageUrl.protocol !== 'https:' || !allowedHosts.has(imageUrl.hostname)) {
        fail(`image host is not allowed at ${sourceUrl}`);
      }

      return {
        sourceId: sourceSlug(sourceUrl),
        sourceUrl,
        name: product.name.trim(),
        price,
        imageUrl: imageUrl.href,
      };
    } catch (error) {
      if (error instanceof SyntaxError) continue;
      throw error;
    }
  }

  fail(`no usable Product JSON-LD found at ${sourceUrl}`);
}

function productLinks(html) {
  const links = new Set();
  for (const match of html.matchAll(/href=["']([^"']*\/products\/[^"'#?]+)["']/gi)) {
    const url = new URL(match[1], storeUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'ezakiparfum.youcan.store') {
      continue;
    }
    url.search = '';
    url.hash = '';
    links.add(url.href);
  }
  return [...links];
}

async function readJsonIfPresent(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function fallbackProducts() {
  const source = await readFile(fallbackFile, 'utf8');
  return [...source.matchAll(/product\(\s*'([^']+)'\s*,\s*'[^']*'/g)].map((match) => ({
    id: match[1],
    slug: match[1],
  }));
}

async function downloadImage(imageUrl, localSlug) {
  let currentUrl = imageUrl;
  for (let redirectCount = 0; redirectCount <= 3; redirectCount += 1) {
    const url = new URL(currentUrl);
    if (url.protocol !== 'https:' || !allowedHosts.has(url.hostname)) {
      fail(`image redirect target is not allowed: ${currentUrl}`);
    }

    const response = await fetch(currentUrl, {
      redirect: 'manual',
      signal: AbortSignal.timeout(requestTimeoutMs),
      headers: { 'user-agent': 'EZAKI-product-sync/1.0' },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location || redirectCount === 3) fail(`too many image redirects: ${imageUrl}`);
      currentUrl = new URL(location, currentUrl).href;
      continue;
    }
    if (!response.ok) fail(`image returned HTTP ${response.status}: ${imageUrl}`);

    const contentType = response.headers.get('content-type')?.split(';')[0].toLowerCase();
    const extension = imageExtensions[contentType];
    if (!extension) fail(`image is not a supported image type: ${imageUrl}`);

    const contentLength = Number(response.headers.get('content-length'));
    if (Number.isFinite(contentLength) && contentLength > maxImageBytes) {
      fail(`image exceeds ${maxImageBytes} bytes: ${imageUrl}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length === 0 || buffer.length > maxImageBytes) {
      fail(`invalid image size: ${imageUrl}`);
    }

    const filename = `synced-${safeSlug(localSlug)}${extension}`;
    const temporary = join(productsDir, `.${filename}.tmp`);
    const destination = join(productsDir, filename);
    await writeFile(temporary, buffer, { flag: 'wx' });
    return { temporary, destination, publicPath: `/images/products/${filename}` };
  }

  fail(`unable to download image: ${imageUrl}`);
}

function renderCatalog(entries) {
  const lines = entries
    .sort((a, b) => a.localId.localeCompare(b.localId))
    .map(
      (entry) =>
        `  ${JSON.stringify(entry.localId)}: { sourceId: ${JSON.stringify(entry.sourceId)}, sourceUrl: ${JSON.stringify(entry.sourceUrl)}, name: ${JSON.stringify(entry.name)}, price: ${entry.price}, image: ${JSON.stringify(entry.image)} },`,
    )
    .join('\n');
  return `/**
 * GENERATED FILE — do not edit manually.
 * Produced by \`npm run sync-products\`.
 */

export type SyncedProduct = {
  sourceId: string;
  sourceUrl: string;
  name: string;
  price: number;
  image: string;
};

export const syncedProducts: Record<string, SyncedProduct> = {
${lines}
};
`;
}

async function atomicReplace(file, content) {
  const temporary = `${file}.tmp`;
  await writeFile(temporary, content, 'utf8');
  await rename(temporary, file);
}

async function main() {
  await mkdir(productsDir, { recursive: true });
  const homepage = await fetchText(storeUrl);
  const urls = productLinks(homepage);
  if (urls.length === 0) fail('no product links found on the EZAKI store homepage');

  const fallback = await fallbackProducts();
  const existingMapping = await readJsonIfPresent(mappingFile, {});
  const mapping = { ...existingMapping };
  const usedIds = new Set(fallback.map((entry) => entry.id));
  const synchronized = [];
  const temporaryImages = [];

  try {
    for (const url of urls) {
      const remote = parseJsonLd(await fetchText(url), url);
      const existing = mapping[url];
      const fallbackMatch =
        fallback.find((entry) => entry.slug === remote.sourceId) ??
        fallback.find((entry) => entry.id === remote.sourceId);
      const localSlug = fallbackMatch?.slug ?? existing?.localSlug ?? safeSlug(remote.sourceId);
      const localId = fallbackMatch?.id ?? existing?.localId ?? `ezaki-${localSlug}`;

      if (usedIds.has(localId) && !fallbackMatch && !Object.values(mapping).some((entry) => entry.localId === localId)) {
        fail(`local ID collision for source ${url}`);
      }
      usedIds.add(localId);

      const image = await downloadImage(remote.imageUrl, localSlug);
      temporaryImages.push(image);
      synchronized.push({ ...remote, localId, localSlug, image: image.publicPath });
      mapping[url] = { sourceId: remote.sourceId, localId, localSlug };
    }

    const sourceIds = new Set();
    for (const entry of synchronized) {
      if (sourceIds.has(entry.sourceId)) fail(`duplicate source product ID: ${entry.sourceId}`);
      sourceIds.add(entry.sourceId);
    }

    for (const image of temporaryImages) await rename(image.temporary, image.destination);
    await atomicReplace(generatedCatalogFile, renderCatalog(synchronized));
    await atomicReplace(mappingFile, `${JSON.stringify(mapping, null, 2)}\n`);

    console.log(`Synchronized products: ${synchronized.length}`);
    console.log(`Downloaded images: ${temporaryImages.length}`);
    console.log('Skipped or ambiguous products: 0');
  } catch (error) {
    await Promise.all(
      temporaryImages.map((image) => rm(image.temporary, { force: true }).catch(() => {})),
    );
    throw error;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
