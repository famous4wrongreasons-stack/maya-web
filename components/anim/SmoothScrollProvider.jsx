"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

// Lenis smooth scroll, синхронизированный с GSAP ScrollTrigger.
// Смонтирован ТОЛЬКО на /showcase → не влияет на остальной (нативный) сайт.
export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // каждое событие скролла обновляет триггеры
    lenis.on("scroll", ScrollTrigger.update);

    // Lenis крутится на тикере GSAP — один rAF на всё
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // пересчёт после монтирования (картинки/шрифты меняют высоту)
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const t = setTimeout(() => ScrollTrigger.refresh(), 600);

    return () => {
      clearTimeout(t);
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return children;
}
