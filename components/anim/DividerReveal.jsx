"use client";

import { useRef, useEffect } from "react";
import { gsap } from "./gsap";

// Разделитель: scaleX 0 → 1, transform-origin: left.
export default function DividerReveal({
  className = "",
  color = "var(--maya)",
  thickness = 2,
  duration = 1,
  ease = "power3.out",
  start = "top 92%",
  delay = 0,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        { scaleX: 1, duration, ease, delay, scrollTrigger: { trigger: el, start } }
      );
    }, el);
    return () => ctx.revert();
  }, [duration, ease, start, delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ height: thickness, background: color, transformOrigin: "left center", transform: "scaleX(0)", width: "100%" }}
    />
  );
}
