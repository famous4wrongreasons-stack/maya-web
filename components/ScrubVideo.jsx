"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";

// Видео, перематываемое СКРОЛЛОМ. rAF работает только пока элемент в зоне
// видимости (IntersectionObserver) — без постоянной нагрузки.
export default function ScrubVideo({ src, className, poster, offset = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Прогрев декодера (мобила/Safari): без play() сначала seek не рисует кадр.
    const warm = () => {
      try {
        const p = v.play();
        if (p && p.then) p.then(() => { try { v.pause(); v.currentTime = 0.01; } catch (e) {} }).catch(() => {});
        else { try { v.pause(); v.currentTime = 0.01; } catch (e) {} }
      } catch (e) {}
    };
    v.addEventListener("loadedmetadata", warm);
    if (v.readyState >= 1) warm();

    let raf = 0, lastP = -1, running = false;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const rect = v.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
      if (Math.abs(p - lastP) < 0.002) return;
      lastP = p;
      if (v.duration) {
        const tp = (((p + offset) % 1) + 1) % 1;
        const t = Math.min(tp, 0.9999) * v.duration;
        if (Math.abs(v.currentTime - t) > 0.03) { try { v.currentTime = t; } catch (e) {} }
      }
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "150px" });
    io.observe(v);

    return () => { stop(); io.disconnect(); v.removeEventListener("loadedmetadata", warm); };
  }, [offset]);

  return (
    <video ref={ref} className={className} muted playsInline preload="auto" poster={asset(poster)}>
      <source src={asset(src)} type="video/mp4" />
    </video>
  );
}
