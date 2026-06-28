"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

const KEY = "maya_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  // Восстанавливаем корзину из localStorage (один раз на клиенте)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {}
    setReady(true);
  }, []);

  // Сохраняем при каждом изменении
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  }, [items, ready]);

  const add = (item) =>
    setItems((p) => {
      const i = p.findIndex((x) => x.id === item.id);
      if (i >= 0) {
        const next = [...p];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...p, { ...item, qty: 1 }];
    });

  const remove = (id) => setItems((p) => p.filter((x) => x.id !== id));
  const setQty = (id, qty) => setItems((p) => p.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)));
  const clear = () => setItems([]);

  const count = items.reduce((s, x) => s + x.qty, 0);
  const total = items.reduce((s, x) => s + x.amount * x.qty, 0);

  return (
    <CartCtx.Provider value={{ items, add, remove, setQty, clear, count, total, ready }}>
      {children}
    </CartCtx.Provider>
  );
}

// Кнопка-корзина в шапке магазина: иконка + счётчик
export function CartButton() {
  const { count } = useCart();
  return (
    <Link
      href="/shop/checkout"
      className="relative inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[11px] uppercase tracking-wide2 text-ink/80 transition-colors hover:border-ink/30 hover:text-ink"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6L5 3H3" />
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
      </svg>
      Корзина
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium leading-none text-base">
          {count}
        </span>
      )}
    </Link>
  );
}
