'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type RevealCallback = (isVisible: boolean) => void;

let sharedObserver: IntersectionObserver | null = null;
const revealCallbacks = new Map<Element, RevealCallback>();

function getSharedObserver() {
  if (sharedObserver) return sharedObserver;

  sharedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        revealCallbacks.get(entry.target)?.(entry.isIntersecting);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
  );

  return sharedObserver;
}

type RevealProps = {
  children: ReactNode;
  /** Retard de l'animation en millisecondes. */
  delay?: number;
  className?: string;
  as?: ElementType;
  /** Marge de declenchement de l'IntersectionObserver. */
  once?: boolean;
};

/**
 * Fait apparaitre son contenu en fondu + leger glissement lors du scroll.
 * Utilise une seule fois par element pour rester leger.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = getSharedObserver();
    const callback: RevealCallback = (isVisible) => {
      if (isVisible) {
        setVisible(true);
        if (once) {
          revealCallbacks.delete(node);
          observer.unobserve(node);
        }
      } else if (!once) {
        setVisible(false);
      }
    };

    revealCallbacks.set(node, callback);
    observer.observe(node);
    return () => {
      revealCallbacks.delete(node);
      observer.unobserve(node);
    };
  }, [once]);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn('reveal', visible && 'reveal-visible', className)}
    >
      {children}
    </Tag>
  );
}