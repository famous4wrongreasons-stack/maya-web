"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";

// Полноэкранная scroll-scrub сцена (и на десктопе, и на мобиле). Перематывается
// скроллом. КЛЮЧ для мобилы/Safari: «прогрев» декодера — короткий play()→pause(),
// иначе seek не рисует кадр (видео остаётся чёрным). rAF гейтится IntersectionObserver.
export default function ScrubScene({ src, length = 175, fit = "object-cover" }) {
  const root = useRef(null);
  const vid = useRef(null);

  useEffect(() => {
    const v = vid.current, r = root.current;
    if (!v || !r) return;

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
      const rect = r.getBoundingClientRect();
      const scrollable = Math.max(rect.height - window.innerHeight, 1);
      const p = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      if (Math.abs(p - lastP) < 0.003) return;
      lastP = p;
      if (v.duration) {
        const t = Math.min(p, 0.9999) * v.duration;
        if (Math.abs(v.currentTime - t) > 0.04) { try { v.currentTime = t; } catch (e) {} }
      }
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "150px" });
    io.observe(r);

    return () => { stop(); io.disconnect(); v.removeEventListener("loadedmetadata", warm); };
  }, []);

  return (
    <section ref={root} className="scrub-scene relative w-full bg-black" style={{ height: `${length}vh` }}>
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black">
        <video ref={vid} className={`h-full w-full ${fit}`} muted playsInline preload="auto">
          <source src={asset(src)} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-base from-12% via-base/18 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-base via-base/55 to-transparent" />
      </div>
    </section>
  );
}
