"use client";

// Единая точка входа GSAP + ScrollTrigger. Плагин регистрируется один раз на клиенте.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Кривые из брифа
export const EASE = {
  expo: "expo.out",
  power3: "power3.out",
  power4: "power4.out",
  none: "none",
};

export { gsap, ScrollTrigger };
