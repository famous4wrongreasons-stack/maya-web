"use client";

import { useRef, useEffect } from "react";
import { gsap } from "./gsap";

// Параллакс: элемент дрейфует по Y относительно скролла. speed > 0 — «отстаёт»
// (двигается медленнее), speed < 0 — «опережает». scrub 0.6–0.9.
export default function ParallaxLayer({
  children,
  speed = 0.3,
  className = "",
  scrub = 0.8,
  axis = "y",
  as: Tag = "div",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // На мобиле параллакс отключаем: элемент уплывает за свои границы и наезжает на соседние блоки.
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const dist = speed * 100; // в процентах от собственного размера
    const prop = axis === "x" ? "xPercent" : "yPercent";
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { [prop]: -dist },
        {
          [prop]: dist,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [speed, scrub, axis]);

  return (
    <Tag ref={ref} className={className} data-parallax-speed={speed} style={{ willChange: "transform" }}>
      {children}
    </Tag>
  );
}
