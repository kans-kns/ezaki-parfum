'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Product } from '@/lib/products';

const STORAGE_KEY = 'ezaki-parfum-panier-v1';

export type CartLine = {
  slug: string;
  quantity: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
  total: number;
};

type CartContextValue = {
  items: CartItem[];
  /** Nombre total d'articles (toutes quantites confondues). */
  count: number;
  subtotal: number;
  /** Economie totale liee aux anciens prix. */
  savings: number;
  isOpen: boolean;
  isEmpty: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Reconstruit les lignes stockees en filtrant les produits qui n'existent plus. */
function parseStoredLines(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => {
        if (typeof entry !== 'object' || entry === null) return null;
        const { slug, quantity } = entry as { slug?: unknown; quantity?: unknown };
        if (typeof slug !== 'string') return null;
        const safeQuantity = typeof quantity === 'number' && quantity > 0 ? Math.floor(quantity) : 1;
        return { slug, quantity: Math.min(safeQuantity, 20) };
      })
      .filter((line): line is CartLine => line !== null);
  } catch {
    return [];
  }
}

export function CartProvider({
  children,
  products,
}: {
  children: ReactNode;
  products: Product[];
}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Chargement depuis le localStorage (une seule fois, cote client)
  useEffect(() => {
    setLines(parseStoredLines(window.localStorage.getItem(STORAGE_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setLines((current) => current.filter((line) => products.some((product) => product.slug === line.slug)));
  }, [hydrated, products]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  // Bloque le scroll du body quand le tiroir panier est ouvert
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const addItem = useCallback((slug: string, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.slug === slug);
      if (existing) {
        return current.map((line) =>
          line.slug === slug
            ? { ...line, quantity: Math.min(line.quantity + quantity, 20) }
            : line,
        );
      }
      return [...current, { slug, quantity: Math.min(Math.max(quantity, 1), 20) }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug: string) => {
    setLines((current) => current.filter((line) => line.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setLines((current) => {
      if (quantity <= 0) return current.filter((line) => line.slug !== slug);
      return current.map((line) =>
        line.slug === slug ? { ...line, quantity: Math.min(quantity, 20) } : line,
      );
    });
  }, []);

  const clearCart = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const items: CartItem[] = lines.flatMap((line) => {
      const product = products.find((entry) => entry.slug === line.slug && entry.inStock);
      if (!product) return [];
      return [{ product, quantity: line.quantity, total: product.price * line.quantity }];
    });

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const savings = items.reduce(
      (sum, item) =>
        sum + (item.product.oldPrice ? (item.product.oldPrice - item.product.price) * item.quantity : 0),
      0,
    );

    return {
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      savings,
      isOpen,
      isEmpty: items.length === 0,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    };
  }, [lines, products, isOpen, openCart, closeCart, addItem, removeItem, setQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Acces au panier. Doit etre utilise sous <CartProvider>. */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé à l\'intérieur de <CartProvider>');
  }
  return context;
}