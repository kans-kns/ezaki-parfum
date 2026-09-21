/**
 * Genere les visuels vectoriels premium de la marque (flacons, packaging,
 * lifestyle) dans public/images.
 *
 *   node scripts/generate-assets.mjs
 *
 * Les fichiers produits peuvent ensuite etre remplaces par de vraies photos
 * (meme nom de fichier, ou en mettant a jour lib/products.ts).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { filmGrain, vignette, vignetteLayer, grainLayer } from './photo-filters.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public', 'images');

const GOLD = '#C9A227';
const GOLD_LIGHT = '#E5C76B';
const GOLD_DEEP = '#8C6F14';

/** Degrade dore, reutilise par tous les visuels. */
const goldGradient = (id) => `
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${GOLD_DEEP}"/>
      <stop offset="45%" stop-color="${GOLD_LIGHT}"/>
      <stop offset="100%" stop-color="${GOLD}"/>
    </linearGradient>`;

/** Bouchon du flacon. */
const cap = (x, y, w, h, fill, gradientId) => `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}"/>
      <rect x="${x + w * 0.18}" y="${y + 6}" width="${w * 0.16}" height="${h - 12}" rx="6" fill="${
        gradientId ? `url(#${gradientId})` : '#ffffff'
      }" opacity="0.35"/>
    </g>`;

/**
 * Flacon de parfum stylise (viewBox 800x1000).
 * @param {{ label?: string; arabic: string; accent: string; glass: [string, string]; capFill: string }} o
 */
function bottleSvg({ label = 'EZAKI', arabic, accent, glass, capFill }) {
  const [glassLight, glassDark] = glass;
  return `  <g>
${goldGradient('gold-1')}
${goldGradient('gold-2')}${cap(322, 96, 156, 108, capFill, 'gold-2')}
    <rect x="360" y="198" width="80" height="46" fill="url(#gold-1)" opacity="0.9"/>
    <rect x="286" y="288" width="294" height="70" rx="18" fill="url(#gold-1)"/>
    <path d="M262 356 L604 356 L644 806 Q648 880 582 890 L284 890 Q218 880 222 806 Z" fill="url(#glass-1)" stroke="url(#gold-1)" stroke-width="4"/>
    <path d="M300 372 L360 372 L330 866 L282 862 Z" fill="${glassLight}" opacity="0.22"/>
    <rect x="286" y="560" width="230" height="2" fill="url(#gold-1)" opacity="0.5"/>
    <text x="401" y="530" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="46" letter-spacing="6" fill="url(#gold-1)">${label}</text>
    <text x="401" y="640" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="34" letter-spacing="10" fill="url(#gold-1)" opacity="0.85">PARFUM</text>
    <text x="401" y="700" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="${accent}" opacity="0.75">${arabic}</text>
    <circle cx="401" cy="446" r="34" fill="none" stroke="url(#gold-1)" stroke-width="2" opacity="0.8"/>
    <text x="401" y="459" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="url(#gold-1)">E</text>
    <ellipse cx="401" cy="920" rx="210" ry="34" fill="#000000" opacity="0.5"/>
  </g>`;
}
/** Carte produit complete : fond noir, halo dore, flacon. */
function productCard({ name, label = 'EZAKI', arabic, accent, glass, capFill }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" role="img" aria-label="Flacon de parfum ${name}">
  <defs>
    <linearGradient id="glass-1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${glass[0]}"/>
      <stop offset="100%" stop-color="${glass[1]}"/>
    </linearGradient>
    <radialGradient id="halo-1" cx="50%" cy="46%" r="52%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.42"/>
      <stop offset="60%" stop-color="${GOLD}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>${vignette}${filmGrain}
  </defs>
  <rect width="800" height="1000" fill="#0B0B0B"/>
  <circle cx="400" cy="470" r="420" fill="url(#halo-1)"/>
  <circle cx="400" cy="880" r="330" fill="none" stroke="${GOLD}" stroke-opacity="0.12" stroke-width="2"/>
  <circle cx="400" cy="880" r="250" fill="none" stroke="${GOLD}" stroke-opacity="0.10" stroke-width="2"/>
${bottleSvg({ label, arabic, accent, glass, capFill })}
  ${vignetteLayer}
  ${grainLayer}
  <rect x="24" y="24" width="752" height="952" rx="28" fill="none" stroke="${GOLD}" stroke-opacity="0.18"/>
</svg>
`;
}

export const palette = [
  {
    file: 'ezaki-noir.svg',
    name: 'EZAKI Noir',
    label: 'NOIR',
    arabic: 'نوار',
    accent: GOLD_LIGHT,
    glass: ['#232323', '#050505'],
    capFill: '#0D0D0D',
  },
  {
    file: 'ezaki-royal.svg',
    name: 'EZAKI Royal',
    label: 'ROYAL',
    arabic: 'رويال',
    accent: GOLD,
    glass: ['#2A2118', '#070502'],
    capFill: GOLD_DEEP,
  },
  {
    file: 'ezaki-oud.svg',
    name: 'EZAKI Oud',
    label: 'OUD',
    arabic: 'العود',
    accent: GOLD_LIGHT,
    glass: ['#3A2418', '#0C0503'],
    capFill: '#1B1008',
  },
  {
    file: 'ezaki-elegance.svg',
    name: 'EZAKI Élégance',
    label: 'ÉLÉGANCE',
    arabic: 'إيليغانس',
    accent: GOLD_LIGHT,
    glass: ['#3A2F33', '#0A0708'],
    capFill: '#F0E6D5',
  },
  {
    file: 'ezaki-blanc.svg',
    name: 'EZAKI Blanc',
    label: 'BLANC',
    arabic: 'بلان',
    accent: GOLD,
    glass: ['#4A4F55', '#101214'],
    capFill: '#D9DEE2',
  },
  {
    file: 'ezaki-ambre.svg',
    name: 'EZAKI Ambre',
    label: 'AMBRE',
    arabic: 'عنبر',
    accent: GOLD_LIGHT,
    glass: ['#4A3417', '#0D0703'],
    capFill: '#3A2610',
  },
];
/** Visuel d'ambiance pour les sections editoriales (hero, a propos). */
function ambienceSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200" role="img" aria-label="Ambiance EZAKI Parfum">
  <defs>
    <radialGradient id="glow" cx="50%" cy="38%" r="55%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="${GOLD}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldline" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${GOLD_DEEP}"/>
      <stop offset="50%" stop-color="${GOLD_LIGHT}"/>
      <stop offset="100%" stop-color="${GOLD}"/>
    </linearGradient>
    <linearGradient id="glass-1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2A2A2A"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>${vignette}${filmGrain}
  </defs>
  <rect width="1200" height="1200" fill="#080808"/>
  <circle cx="600" cy="470" r="560" fill="url(#glow)"/>
  <g stroke="${GOLD}" stroke-opacity="0.13" fill="none" stroke-width="1.5">
    <path d="M600 120 L760 280 L600 440 L440 280 Z"/>
    <path d="M600 180 L710 290 L600 400 L490 290 Z"/>
    <path d="M600 240 L660 300 L600 360 L540 300 Z"/>
    <path d="M600 760 L760 920 L600 1080 L440 920 Z"/>
    <path d="M180 600 L300 720 L180 840 L60 720 Z"/>
    <path d="M1020 600 L1140 720 L1020 840 L900 720 Z"/>
  </g>
  <g transform="translate(300 230) scale(0.62)" stroke-linejoin="round">
${bottleSvg({ label: 'EZAKI', arabic: 'عطر', accent: GOLD_LIGHT, glass: ['#2A2A2A', '#050505'], capFill: GOLD_DEEP })}
  </g>
  ${vignetteLayer}
  ${grainLayer}
</svg>
`;
}

/** Visuel packaging / coffret cadeau. */
function packagingSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img" aria-label="Coffret EZAKI Parfum">
  <defs>
${goldGradient('g')}
    <radialGradient id="halo" cx="50%" cy="55%" r="55%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>${vignette}${filmGrain}
  </defs>
  <rect width="800" height="800" fill="#0A0A0A"/>
  <circle cx="400" cy="440" r="400" fill="url(#halo)"/>
  <rect x="330" y="238" width="140" height="62" rx="31" fill="none" stroke="url(#g)" stroke-width="2" opacity="0.7"/>
  <rect x="180" y="298" width="440" height="322" rx="16" fill="#151515" stroke="url(#g)" stroke-width="2"/>
  <rect x="180" y="298" width="440" height="66" rx="16" fill="url(#g)" opacity="0.9"/>
  <text x="400" y="344" text-anchor="middle" font-family="Georgia, serif" font-size="30" letter-spacing="9" fill="#0A0A0A">EZAKI</text>
  <text x="400" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="46" letter-spacing="12" fill="url(#g)">EZAKI</text>
  <text x="400" y="522" text-anchor="middle" font-family="Georgia, serif" font-size="26" letter-spacing="14" fill="url(#g)" opacity="0.85">PARFUM</text>
  <text x="400" y="580" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="${GOLD_LIGHT}" opacity="0.7">عطر فاخر</text>
  ${vignetteLayer}
  ${grainLayer}
  <rect x="24" y="24" width="752" height="752" rx="26" fill="none" stroke="${GOLD}" stroke-opacity="0.16"/>
</svg>
`;
}
/** Visuel lifestyle : ambiance boudoir, vaporisateur dore. */
function lifestyleSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img" aria-label="L'art de se parfumer avec EZAKI">
  <defs>
${goldGradient('g2')}
    <radialGradient id="halo2" cx="46%" cy="38%" r="60%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="silk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1C1710"/>
      <stop offset="100%" stop-color="#070606"/>
    </linearGradient>${vignette}${filmGrain}
    <linearGradient id="glass-1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2E2E2E"/>
      <stop offset="100%" stop-color="#060606"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="#0A0A0A"/>
  <circle cx="380" cy="330" r="420" fill="url(#halo2)"/>
  <path d="M0 560 Q200 470 400 560 T800 540 L800 800 L0 800 Z" fill="url(#silk)"/>
  <g transform="translate(250 170) scale(0.42)" stroke-linejoin="round">
${bottleSvg({ label: 'EZAKI', arabic: 'عطر', accent: GOLD_LIGHT, glass: ['#2E2E2E', '#060606'], capFill: '#141414' })}
  </g>
  <g stroke="${GOLD}" stroke-opacity="0.4" fill="none" stroke-width="2">
    <path d="M110 320 q40 -30 80 0 q40 30 80 0"/>
    <path d="M590 262 q34 -26 68 0 q34 26 68 0"/>
  </g>
  <text x="400" y="690" text-anchor="middle" font-family="Georgia, serif" font-size="34" letter-spacing="10" fill="url(#g2)">EZAKI PARFUM</text>
  <text x="400" y="734" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="${GOLD_LIGHT}" opacity="0.75">عطر يليق بك</text>
  <!-- reflets de lumiere tamisee -->
  <g opacity="0.5">
    <path d="M0 640 Q200 600 400 648 T800 620" stroke="${GOLD}" stroke-opacity="0.16" fill="none" stroke-width="1.5"/>
    <path d="M0 690 Q220 650 420 700 T800 672" stroke="${GOLD}" stroke-opacity="0.10" fill="none" stroke-width="1.5"/>
  </g>
  ${vignetteLayer}
  ${grainLayer}
  <rect x="24" y="24" width="752" height="752" rx="26" fill="none" stroke="${GOLD}" stroke-opacity="0.16"/>
</svg>
`;
}

/** Monogramme rond, favicon et logo de marque. */
function logoMarkSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="Logo EZAKI Parfum">
  <defs>
${goldGradient('lg')}
    <radialGradient id="lghalo" cx="50%" cy="42%" r="62%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="256" cy="256" r="256" fill="#080808"/>
  <circle cx="256" cy="256" r="250" fill="url(#lghalo)"/>
  <circle cx="256" cy="256" r="228" fill="none" stroke="url(#lg)" stroke-width="3"/>
  <circle cx="256" cy="256" r="206" fill="none" stroke="${GOLD}" stroke-opacity="0.35" stroke-width="1.5"/>
  <text x="256" y="262" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="168" fill="url(#lg)">E</text>
  <text x="256" y="328" text-anchor="middle" font-family="Georgia, serif" font-size="44" letter-spacing="14" fill="url(#lg)">EZAKI</text>
  <text x="256" y="374" text-anchor="middle" font-family="Georgia, serif" font-size="26" letter-spacing="16" fill="${GOLD_LIGHT}" opacity="0.85">PARFUM</text>
</svg>
`;
}

/** Logo horizontal (navbar / footer). */
function logoWideSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 200" width="640" height="200" role="img" aria-label="EZAKI Parfum">
  <defs>
${goldGradient('wg')}
  </defs>
  <circle cx="92" cy="100" r="62" fill="none" stroke="url(#wg)" stroke-width="3"/>
  <circle cx="92" cy="100" r="52" fill="none" stroke="${GOLD}" stroke-opacity="0.4" stroke-width="1.5"/>
  <text x="92" y="130" text-anchor="middle" font-family="Georgia, serif" font-size="68" fill="url(#wg)">E</text>
  <text x="186" y="104" font-family="Georgia, serif" font-size="64" letter-spacing="8" fill="url(#wg)">EZAKI</text>
  <text x="188" y="152" font-family="Georgia, serif" font-size="34" letter-spacing="14" fill="${GOLD_LIGHT}" opacity="0.9">PARFUM</text>
</svg>
`;
}

const files = [
  ...palette.map((product) => [join(publicDir, 'products', product.file), productCard(product)]),
  [join(publicDir, 'brand', 'ambience.svg'), ambienceSvg()],
  [join(publicDir, 'brand', 'packaging.svg'), packagingSvg()],
  [join(publicDir, 'brand', 'lifestyle.svg'), lifestyleSvg()],
  [join(publicDir, 'brand', 'logo-mark.svg'), logoMarkSvg()],
  [join(publicDir, 'brand', 'logo-wide.svg'), logoWideSvg()],
  [join(root, 'app', 'icon.svg'), logoMarkSvg()],
];

await Promise.all(
  files.map(async ([path, content]) => {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content, 'utf8');
  }),
);

console.log(`Visuels generes : ${files.length} fichiers`);