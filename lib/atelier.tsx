'use client';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/** Atelier (cart) — slide-over state, persisted locally. Two exits: checkout / WhatsApp. */
export interface CartItem {
  key: string; // modelCode__color__size
  modelCode: string;
  name: string;
  color: string;
  size?: string;
  price: number;
  qty: number;
  imageUrl?: string;
}

interface AtelierCtx {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, 'key' | 'qty'>, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

const Ctx = createContext<AtelierCtx | null>(null);
const LS_KEY = 'she-atelier-v1';

export function AtelierProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const value = useMemo<AtelierCtx>(() => ({
    items, open, setOpen,
    add: (item, qty = 1) => {
      const key = `${item.modelCode}__${item.color}__${item.size ?? 'OS'}`;
      setItems((prev) => {
        const found = prev.find((p) => p.key === key);
        if (found) return prev.map((p) => (p.key === key ? { ...p, qty: Math.min(p.qty + qty, 9) } : p));
        return [...prev, { ...item, key, qty }];
      });
      setOpen(true);
    },
    remove: (key) => setItems((prev) => prev.filter((p) => p.key !== key)),
    setQty: (key, qty) => setItems((prev) =>
      qty <= 0 ? prev.filter((p) => p.key !== key) : prev.map((p) => (p.key === key ? { ...p, qty: Math.min(qty, 9) } : p)),
    ),
    clear: () => setItems([]),
    subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
    count: items.reduce((s, i) => s + i.qty, 0),
  }), [items, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAtelier(): AtelierCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAtelier outside provider');
  return v;
}

/** My SHE (saved) — local now, structured for future accounts. */
export interface SavedPick { modelCode: string; color: string; slug: string; name: string; price: number; }

const SHE_KEY = 'she-myshe-v1';
export function useMyShe() {
  const [picks, setPicks] = useState<SavedPick[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SHE_KEY);
      if (raw) setPicks(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(SHE_KEY, JSON.stringify(picks)); } catch { /* ignore */ }
  }, [picks]);
  return {
    picks,
    has: (modelCode: string, color: string) => picks.some((p) => p.modelCode === modelCode && p.color === color),
    toggle: (pick: SavedPick) => setPicks((prev) =>
      prev.some((p) => p.modelCode === pick.modelCode && p.color === pick.color)
        ? prev.filter((p) => !(p.modelCode === pick.modelCode && p.color === pick.color))
        : [...prev, pick],
    ),
    remove: (modelCode: string, color: string) => setPicks((prev) => prev.filter((p) => !(p.modelCode === modelCode && p.color === color))),
  };
}
