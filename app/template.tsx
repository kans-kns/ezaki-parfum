import type { ReactNode } from 'react';

/**
 * Template de page : rejoue l'animation de fondu a chaque navigation,
 * ce qui donne une transition douce entre les pages.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="animate-fade-up">{children}</div>;
}