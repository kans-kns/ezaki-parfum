/** Concatene des classes CSS conditionnelles (equivalent minimal de clsx). */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Tronque proprement un texte pour les extraits. */
export function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max).trimEnd()}…`;
}

/** Numero de commande lisible, ex: EZ-8F3K2 */
export function orderReference(): string {
  return `EZ-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
