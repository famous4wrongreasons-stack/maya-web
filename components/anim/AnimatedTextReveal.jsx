"use client";

import { useRef, useEffect, createElement } from "react";
import { gsap } from "./gsap";

// Заголовок разбивается на слова; каждое слово в маске (overflow-hidden),
// внутренняя обёртка стартует yPercent:105 / opacity:0 → въезжает к 0 / 1.
export default function AnimatedTextReveal({
  as = "h2",
  text,
  className = "",
  innerClassName = "",
  stagger = 0.08,        // 0.055–0.15 по брифу
  duration = 1.1,        // 0.8–1.4
  ease = "expo.out",
  start = "top 85%",
  delay = 0,
  once = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inners = el.querySelectorAll("[data-word-inner]");
    const ctx = gsap.context(() => {
      gsap.set(inners, { yPercent: 105, opacity: 0 });
      gsap.to(inners, {
        yPercent: 0,
        opacity: 1,
        duration,
        ease,
        stagger,
        delay,
        scrollTrigger: { trigger: el, start, toggleActions: once ? "play none none none" : "play none none reverse" },
      });
    }, el);
    return () => ctx.revert();
  }, [text, stagger, duration, ease, start, delay, once]);

  const tokens = String(text).split(/(\s+)/); // сохраняем пробелы

  return createElement(
    as,
    { ref, className, "aria-label": String(text) },
    tokens.map((tok, i) =>
      tok.trim() === "" ? (
        <span key={i} aria-hidden> </span>
      ) : (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
          <span data-word-inner className={`inline-block will-change-transform ${innerClassName}`}>
            {tok}
          </span>
        </span>
      )
    )
  );
}
