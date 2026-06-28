"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "./gsap";

// Закреплённая (pin) scroll-история: длинная секция, внутри сцены (фото + текст)
// меняют позицию и прозрачность по мере скролла. scrub:1, height 2400–5000px.
export default function PinnedStorySection({
  scenes = [],
  height = 3800,
  className = "",
  eyebrow = "",
  bgVideo = "",
}) {
  const root = useRef(null);
  const inner = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current, pin = inner.current;
    if (!el || !pin || scenes.length === 0) return;
    const sceneEls = pin.querySelectorAll("[data-scene]");
    const imgEls = pin.querySelectorAll("[data-scene-img]");
    const fill = pin.querySelector("[data-progress-fill]");

    const ctx = gsap.context(() => {
      gsap.set(sceneEls, { opacity: 0, yPercent: 8 });
      gsap.set(sceneEls[0], { opacity: 1, yPercent: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=" + height,
          pin: pin,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length + 0.0001));
            setActive(idx);
            if (fill) gsap.set(fill, { scaleY: self.progress });
          },
        },
      });

      for (let i = 1; i < sceneEls.length; i++) {
        tl.to(sceneEls[i - 1], { opacity: 0, yPercent: -8, duration: 0.5 }, "+=0.55")
          .fromTo(sceneEls[i], { opacity: 0, yPercent: 8 }, { opacity: 1, yPercent: 0, duration: 0.5, ease: "power3.out" }, "<0.12")
          .fromTo(imgEls[i], { scale: 1.16 }, { scale: 1, duration: 1, ease: "power2.out" }, "<");
      }
    }, el);
    return () => ctx.revert();
  }, [scenes, height]);

  return (
    <section ref={root} className={`pinned-story ${className}`} style={{ height }}>
      <div ref={inner} className="relative flex h-[100svh] w-full items-center overflow-hidden">
        {/* Фоновое видео (машинка) — картинки ритуала ложатся прямо поверх него */}
        {bgVideo ? (
          <div className="pointer-events-none absolute inset-0">
            <video className="h-full w-full object-cover" muted playsInline loop autoPlay preload="auto" style={{ filter: "brightness(0.7)" }}>
              <source src={bgVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0" style={{ background: "rgba(7,7,10,0.5)" }} />
          </div>
        ) : null}

        {/* индикатор прогресса */}
        <div className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex">
          <span className="font-display text-sm" style={{ color: "var(--ink)" }}>
            {String(active + 1).padStart(2, "0")}
          </span>
          <div className="relative h-40 w-px" style={{ background: "var(--line)" }}>
            <div data-progress-fill className="absolute inset-x-0 top-0 origin-top" style={{ height: "100%", background: "var(--teal)", transform: "scaleY(0)" }} />
          </div>
          <span className="text-[11px]" style={{ color: "var(--body)" }}>{String(scenes.length).padStart(2, "0")}</span>
        </div>

        {eyebrow ? (
          <span className="absolute left-1/2 top-10 z-20 -translate-x-1/2 text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--teal)" }}>
            {eyebrow}
          </span>
        ) : null}

        {/* сцены (наложены друг на друга) */}
        {scenes.map((s, i) => (
          <article key={i} data-scene className="absolute inset-0 mx-auto flex max-w-6xl items-center px-6 md:px-16">
            <div className={`grid w-full items-center gap-10 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[direction:rtl]" : ""}`}>
              <div className="overflow-hidden rounded-[2rem] md:[direction:ltr]" style={{ aspectRatio: "4 / 5", boxShadow: "0 40px 80px -40px rgba(20,18,12,0.4)" }}>
                <img data-scene-img src={s.image} alt="" className="h-full w-full object-cover" style={{ filter: "grayscale(0.35) contrast(1.03) sepia(0.08)" }} />
              </div>
              <div className="md:[direction:ltr]">
                <span className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--teal)" }}>{s.kicker}</span>
                <h3 className="font-display mt-4 text-4xl leading-[1.05] md:text-6xl" style={{ color: "var(--ink)" }}>{s.title}</h3>
                <p className="mt-6 max-w-md text-[15px] leading-relaxed" style={{ color: "var(--body)" }}>{s.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
