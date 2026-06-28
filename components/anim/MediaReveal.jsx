"use client";

import { useRef, useEffect } from "react";
import { gsap } from "./gsap";

// Карточки/изображения: opacity 0, y 36, scale 0.97 → opacity 1, y 0, scale 1.
export default function MediaReveal({
  children,
  className = "",
  y = 36,
  scale = 0.97,
  duration = 1.2,
  ease = "power3.out",
  start = "top 88%",
  delay = 0,
  as: Tag = "div",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y, scale },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          ease,
          delay,
          scrollTrigger: { trigger: el, start },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [y, scale, duration, ease, start, delay]);

  return (
    <Tag ref={ref} className={className} style={{ willChange: "transform, opacity" }}>
      {children}
    </Tag>
  );
}
