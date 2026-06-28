"use client";

// Lenis отключён: на длинной тяжёлой странице JS-перехват скролла давал лаги.
// Нативный скролл аппаратно-ускорен; scroll-scrub эффекты работают на своём rAF.
// Если захотим вернуть мягкую инерцию — включим Lenis с лёгкими настройками.
export default function SmoothScroll({ children }) {
  return children;
}
