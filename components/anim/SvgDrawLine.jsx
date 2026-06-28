"use client";

import { useRef, useEffect } from "react";
import { gsap } from "./gsap";

// SVG line draw через strokeDasharray / strokeDashoffset.
export default function SvgDrawLine({
  d,
  viewBox = "0 0 200 120",
  className = "",
  stroke = "var(--teal)",
  strokeWidth = 2,
  duration = 1.6,
  ease = "power2.out",
  start = "top 85%",
  delay = 0,
  fill = "none",
}) {
  const pathRef = useRef(null);

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    const ctx = gsap.context(() => {
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(p, {
        strokeDashoffset: 0,
        duration,
        ease,
        delay,
        scrollTrigger: { trigger: p, start },
      });
    });
    return () => ctx.revert();
  }, [d, duration, ease, start, delay]);

  return (
    <svg className={className} viewBox={viewBox} fill={fill} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path ref={pathRef} d={d} stroke={stroke} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
