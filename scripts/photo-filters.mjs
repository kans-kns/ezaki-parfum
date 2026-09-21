/**
 * Filtres photographiques (grain + vignettage + halo) appliques aux visuels
 * vectoriels pour leur donner un rendu plus "photo de studio".
 * Ils sont automatiquement ignores lorsque de vraies photos sont utilisees.
 */
export const filmGrain = `
      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="noise"/>
        <feColorMatrix type="saturate" values="0" in="noise" result="mono"/>
        <feComponentTransfer in="mono" result="soft">
          <feFuncA type="linear" slope="0.16" intercept="0"/>
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="soft" mode="overlay"/>
      </filter>`;

export const vignette = `
      <radialGradient id="vignette" cx="50%" cy="45%" r="72%">
        <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
      </radialGradient>`;

/** Calque de vignettage a poser au-dessus du visuel. */
export const vignetteLayer = `<rect width="100%" height="100%" fill="url(#vignette)"/>`;

/** Calque de grain a poser au-dessus du visuel. */
export const grainLayer = `<rect width="100%" height="100%" filter="url(#grain)" opacity="0.5"/>`;