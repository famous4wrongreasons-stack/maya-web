"use client";

import { useRef, useEffect } from "react";
import { gsap } from "./gsap";

// Сцена: фото кучкой + заголовок «ДИЗАЙН» сверху. По скроллу:
//  • «ДИЗАЙН» медленно гаснет, поднимаясь ВВЕРХ;
//  • «Создаём стиль» поднимается снизу вслед за ним (сквозь фото — 3D-глубина);
//  • фото расходятся МАКСИМАЛЬНО ШИРОКО;
//  • большая бледная «Мужская Эстетика» на фоне проявляется.
// В конце фото поднимаются вверх и уходят (освобождают прайс).
// z: bgText(0) < задние фото(5) < «Создаём стиль»(10) < передние фото(16) < «ДИЗАЙН»(30).
const POS = [
  { fx: -0.70, fy: -0.40, r: -6, s: 0.95, z: 16 }, // far left-up (front) — поднято выше, чтобы не резало рот
  { fx: 0.70, fy: -0.32, r: 5, s: 0.80, z: 16 },   // far right-up (front)
  { fx: -0.66, fy: 0.30, r: 4, s: 0.84, z: 16 },   // far left-down (front)
  { fx: 0.70, fy: 0.24, r: -5, s: 0.76, z: 16 },   // far right-down (front)
  { fx: 0.06, fy: 0.44, r: 7, s: 0.72, z: 5 },     // bottom-center (back)
  { fx: 0.10, fy: -0.46, r: -3, s: 0.88, z: 5 },   // top-center (back)
];

// Мобильная раскладка: 3 ряда × 2 столбца, разведены к краям так, чтобы все 6 фото
// были видны целиком, а по центру оставался вертикальный «коридор» под текст.
const MOBILE_POS = [
  { fx: -0.60, fy: -0.56, r: -7, s: 0.92, z: 16 }, // верх-лево
  { fx: 0.60, fy: -0.58, r: 6, s: 0.92, z: 16 },   // верх-право
  { fx: -0.66, fy: -0.02, r: 4, s: 0.88, z: 12 },  // центр-лево
  { fx: 0.66, fy: 0.00, r: -5, s: 0.88, z: 12 },   // центр-право
  { fx: -0.34, fy: 0.58, r: 8, s: 0.86, z: 5 },    // низ-лево
  { fx: 0.40, fy: 0.56, r: -6, s: 0.86, z: 5 },    // низ-право
];

const TITLE = "font-extralight uppercase leading-[0.92] tracking-[0.08em]";
const SHADOW = { textShadow: "0 2px 26px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.5)", color: "var(--ink)" };

export default function ScatterGallery({
  images = [],
  titleOver = "",
  titleStart = "",
  titleSpread = "",
  bgText = "",
  height = 3600,
  eyebrow = "",
  className = "",
}) {
  const root = useRef(null);
  const inner = useRef(null);

  useEffect(() => {
    const el = root.current, pin = inner.current;
    if (!el || !pin) return;
    const cards = [...pin.querySelectorAll("[data-card]")];
    const tStart = pin.querySelector("[data-title-start]");
    const tSpread = pin.querySelector("[data-title-spread]");
    const bg = pin.querySelector("[data-bg]");

    const ctx = gsap.context(() => {
      const halfW = () => pin.clientWidth * 0.5;
      const halfH = () => pin.clientHeight * 0.5;
      const narrow = () => pin.clientWidth < 640;
      // На мобиле — отдельная раскладка (MOBILE_POS уже подогнана), множитель = 1.
      const posFor = (i) => (narrow() ? MOBILE_POS : POS)[i % POS.length];
      const spread = () => 1;

      cards.forEach((c, i) => {
        gsap.set(c, { xPercent: -50, yPercent: -50, x: 0, y: 0, rotate: (i - (cards.length - 1) / 2) * 5, scale: 0.84, transformOrigin: "50% 50%" });
      });
      if (tStart) gsap.set(tStart, { opacity: 1, yPercent: 0, scale: 1 });
      if (tSpread) gsap.set(tSpread, { opacity: 0, yPercent: 18 });
      if (bg) gsap.set(bg, { opacity: 0, scale: 1.1 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "+=" + height, pin, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true },
      });

      // «ДИЗАЙН» — медленно гаснет, поднимаясь вверх
      if (tStart) tl.to(tStart, { opacity: 0, yPercent: -16, scale: 1.06, ease: "power2.in", duration: 0.65 }, 0);
      // «Создаём стиль» — поднимается снизу вслед за ним
      if (tSpread) tl.to(tSpread, { opacity: 1, yPercent: 0, ease: "power3.out", duration: 0.9 }, 0.42);
      // «Мужская Эстетика» на фоне — проявляется по мере расхождения фото
      if (bg) tl.to(bg, { opacity: 0.06, scale: 1, ease: "none", duration: 1 }, 0.2);

      // фото расходятся максимально широко (на мобиле — по сетке MOBILE_POS)
      cards.forEach((c, i) => {
        const p = posFor(i);
        tl.to(c, { x: () => posFor(i).fx * halfW() * spread(), y: () => posFor(i).fy * halfH() * spread(), rotate: p.r, scale: p.s, ease: "power3.out", duration: 1 }, i * 0.05);
      });

      // в конце фото поднимаются и уходят, тексты гаснут (освобождают прайс)
      tl.to(cards, { y: () => -(halfH() + 480), opacity: 0, ease: "power2.in", duration: 0.8, stagger: 0.06 }, 1.55);
      if (tSpread) tl.to(tSpread, { opacity: 0, yPercent: -12, duration: 0.6 }, 1.7);
      if (bg) tl.to(bg, { opacity: 0, duration: 0.6 }, 1.7);
    }, el);
    return () => ctx.revert();
  }, [images, height]);

  return (
    <section ref={root} className={`pinned-story ${className}`} style={{ height }}>
      <div ref={inner} className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden">
        {eyebrow ? (
          <span className="absolute left-1/2 top-10 z-40 -translate-x-1/2 text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--teal)" }}>
            {eyebrow}
          </span>
        ) : null}

        {/* Фон — большая бледная «Мужская Эстетика» */}
        {bgText ? (
          <h2 data-bg className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center ${TITLE}`} style={{ color: "var(--ink)", zIndex: 0 }}>
            {bgText.split(/\s+/).map((w, i) => (
              <span key={i} className="block text-[clamp(2.4rem,13vw,12rem)]">{w}</span>
            ))}
          </h2>
        ) : null}

        {/* «Создаём стиль» — между слоями фото (3D-глубина) */}
        {titleSpread ? (
          <h2 data-title-spread className={`pointer-events-none absolute inset-0 z-[24] flex flex-col items-center justify-center px-6 text-center md:z-[10] ${TITLE}`} style={SHADOW}>
            {titleSpread.split(/\s+/).map((w, i) => (
              <span key={i} className="block text-[clamp(1.9rem,9vw,7rem)]">{w}</span>
            ))}
          </h2>
        ) : null}

        {/* Фото — кучкой → расходятся; z задаёт глубину */}
        {images.map((src, i) => (
          <div
            key={i}
            data-card
            className="absolute left-1/2 top-1/2 w-[clamp(104px,31vw,355px)] overflow-hidden rounded-xl will-change-transform sm:w-[clamp(120px,38vw,355px)]"
            style={{ aspectRatio: "3 / 4", boxShadow: "0 30px 60px -25px rgba(0,0,0,0.7)", border: "1px solid var(--line)", zIndex: POS[i % POS.length].z }}
          >
            <img src={src} alt="" draggable="false" className="h-full w-full object-cover" style={{ filter: "grayscale(0.25) contrast(1.05)" }} />
          </div>
        ))}

        {/* «ИСПОЛЬЗУЕМ» (мельче) над большим «ДИЗАЙН»; всё гаснет вверх первым */}
        {titleStart ? (
          <h2 data-title-start className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center ${TITLE}`} style={{ ...SHADOW, zIndex: 30 }}>
            {titleOver ? <span className="mb-1 block text-[clamp(1rem,4vw,2.6rem)] tracking-[0.14em] opacity-95 md:mb-2">{titleOver}</span> : null}
            <span className="block text-[clamp(3rem,15vw,12rem)] leading-[0.92]">{titleStart}</span>
          </h2>
        ) : null}
      </div>
    </section>
  );
}
