"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { asset } from "@/lib/asset";
import BookButton from "@/components/BookButton";

const openMaya = (preset) =>
  window.dispatchEvent(new CustomEvent("maya:open", { detail: { preset } }));

const ease = [0.16, 1, 0.3, 1];

// Маска заголовка — векторные контуры «МУЖСКАЯ ЭСТЕТИКА» (Montserrat SemiBold).
// CSS mask-image на обычном <video> работает во ВСЕХ браузерах, включая Safari
// (в отличие от SVG-маски на foreignObject, которую WebKit игнорирует).
// ?v — бастер кэша: у svg на хостинге max-age=7дней, имя файла не меняется ⇒
// при каждой правке маски бампать версию, иначе Safari отдаёт старую из кэша.
const MASK_V = "9";
const MASK = `url("${asset("/media/title-mask.svg")}?v=${MASK_V}")`;

// Масштаб видео ножниц (<1 → ножницы чуть меньше, как было scale(0.9) в оригинале).
const SCISSOR_SCALE = 0.86;

// Нижний блок-CTA (город уже сверху).
function HeroCtas() {
  // Записаться — жёлтая кнопка YClients; Спросить Maya — призрачная. Одинаковая ширина.
  const ctaCls = "btn-fill flex min-w-[230px] items-center justify-center gap-2 rounded-full border border-line px-7 py-3.5 text-[11px] uppercase tracking-wide2 text-ink/85 md:py-3";
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 1.15 }} className="mt-6 flex flex-col items-center gap-3 sm:flex-row md:mt-9">
      <BookButton iconSize={20} className="min-w-[230px] rounded-full px-7 py-3.5 text-[11px] uppercase tracking-wide2 md:py-3" />
      <button onClick={() => openMaya("Подобрать стрижку")} className={ctaCls}>
        <span className="maya-orb-sm" />
        Спросить <span className="font-maya normal-case tracking-normal text-[12px]">Maya</span>
      </button>
    </motion.div>
  );
}

export default function Hero() {
  const root = useRef(null);
  const videoWrap = useRef(null);
  const videoEl = useRef(null);    // зал (scrub: свет приглушён → ярче)
  const darkEl = useRef(null);     // затемнение фона во время пролёта
  const clipEl = useRef(null);     // КОНТЕЙНЕР с маской-буквами (растёт через mask-size)
  const clipVid = useRef(null);    // видео ножниц внутри маски (масштаб + скраб)
  const clipFull = useRef(null);   // КОНТЕЙНЕР раскрытия (чёрный фон во весь экран + opacity)
  const clipFullVid = useRef(null);// видео ножниц раскрытия (масштаб + скраб)
  const metaTop = useRef(null);
  const metaBot = useRef(null);
  const cue = useRef(null);
  const glow = useRef(null);

  // Пролёт «сквозь буквы» — ЕДИНАЯ версия для всех браузеров (как на localhost).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = videoEl.current, w = videoWrap.current, r = root.current, cu = cue.current;
    const dk = darkEl.current, cmv = clipEl.current, cvid = clipVid.current;
    const cfl = clipFull.current, cfvid = clipFullVid.current;
    const mtop = metaTop.current, mbot = metaBot.current;

    const warmOne = (vid) => {
      if (!vid) return;
      const go = () => {
        try {
          const pr = vid.play();
          if (pr && pr.then) pr.then(() => { try { vid.pause(); vid.currentTime = 0.01; } catch (e) {} }).catch(() => {});
          else { try { vid.pause(); vid.currentTime = 0.01; } catch (e) {} }
        } catch (e) {}
      };
      vid.addEventListener("loadedmetadata", go);
      if (vid.readyState >= 1) go();
      return go;
    };
    const warm = warmOne(v);
    const warmClip = warmOne(cvid);
    const warmFull = warmOne(cfvid);

    const clamp = (x) => Math.min(Math.max(x, 0), 1);
    const smooth = (x) => x * x * (3 - 2 * x);

    const scrub = (vid, prog) => {
      if (vid && vid.duration) {
        const ct = prog * (vid.duration - 0.05);
        if (Math.abs(vid.currentTime - ct) > 0.04) { try { vid.currentTime = ct; } catch (e) {} }
      }
    };

    let raf = 0, sp = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!r) return;
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      const rect = r.getBoundingClientRect();
      const scrollable = Math.max(rect.height - vh, 1);
      const p = clamp(-rect.top / scrollable);
      sp += (p - sp) * 0.1;
      if (Math.abs(sp - p) < 0.0004) sp = p;

      // Зал: свет приглушён → ярче (скраб первой трети)
      const lightP = clamp(p / 0.3);
      if (v && v.duration) {
        const t = lightP * 0.72 * v.duration;
        if (Math.abs(v.currentTime - t) > 0.02) { try { v.currentTime = t; } catch (e) {} }
      }
      r.setAttribute("data-tone", lightP > 0.6 ? "light" : "dark");
      if (w) w.style.transform = `scale(${(1.06 + p * 0.04).toFixed(4)})`;
      if (cu) cu.style.opacity = clamp(1 - p / 0.26).toFixed(3);

      const lp = clamp((sp - 0.26) / 0.68);   // буквы летят и растут почти до самого конца (~0.94)
      const cp = clamp(sp / 0.94);            // прогресс скраба ножниц
      const grow = lp * lp;                    // ease-in (lp²): плавный разгон, мягкий вылет без рывка

      // Буквы-окна растут: видео ножниц фиксировано, увеличивается только маска.
      // Большой максимум → буква буквально «вылетает» за экран, прежде чем появятся ножницы.
      const base = window.innerWidth < 768 ? 90 : 86;     // стартовый размер (% ширины); на мобиле меньше, чтобы «ПАРИКМАХЕРСКАЯ» влезала
      // Мобайл (узкий экран): огромный размах → буква накрывает экран целиком (36000).
      // Веб (широкий экран): размах меньше, чтобы буква держалась ЧАСТИЧНОЙ дольше — тогда
      // за ней виден ТЁМНЫЙ ЗАЛ (эффект «ножницы за интерьером», как на мобиле), а полные
      // ножницы проявляются в конце поздним фоном-ножницами (0.80→0.97).
      const max  = window.innerWidth < 768 ? 36000 : 14000;
      const size = (base + grow * (max - base)).toFixed(1);
      if (cmv) { cmv.style.webkitMaskSize = `${size}%`; cmv.style.maskSize = `${size}%`; }

      if (dk) dk.style.opacity = (smooth(clamp(lp / 0.5)) * 0.85).toFixed(3);
      // БЕЗ фейда буквы: clipEl держим непрозрачным — буква не растворяется, а растёт и
      // перекрывает экран (маска). Фон-ножницы (clipFull) поднимаем ПОЗДНО: пока буква летит,
      // за ней тёмный зал (видно именно буквы), ножницы — только в конце, когда буква накрыла
      // экран. На ВЕБЕ позже (0.80→0.97) — без ощущения «наложения». Мобилу не трогаем.
      const revAt  = window.innerWidth < 768 ? 0.72 : 0.80;
      const revLen = window.innerWidth < 768 ? 0.18 : 0.17;
      if (cmv) cmv.style.opacity = "1";
      if (cfl) cfl.style.opacity = smooth(clamp((sp - revAt) / revLen)).toFixed(3);

      scrub(cvid, cp);
      scrub(cfvid, cp);

      const metaOp = (1 - smooth(clamp(lp / 0.12))).toFixed(3);
      if (mtop) mtop.style.opacity = metaOp;
      if (mbot) { mbot.style.opacity = metaOp; mbot.style.pointerEvents = lp > 0.02 ? "none" : "auto"; }
    };

    let running = false;
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "150px" });
    if (r) io.observe(r);
    return () => {
      stop(); io.disconnect();
      v?.removeEventListener("loadedmetadata", warm);
      cvid?.removeEventListener("loadedmetadata", warmClip);
      cfvid?.removeEventListener("loadedmetadata", warmFull);
    };
  }, []);

  useEffect(() => {
    const el = glow.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; });
    };
    window.addEventListener("pointermove", move);
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  // CSS-маска: общие свойства для обоих префиксов
  const maskStyle = {
    WebkitMaskImage: MASK, maskImage: MASK,
    WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
    WebkitMaskPosition: "center", maskPosition: "center",
    WebkitMaskSize: "86%", maskSize: "86%",
  };

  return (
    <section ref={root} data-tone="dark" className="hero-section relative h-[240vh] w-full">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden" style={{ background: "radial-gradient(120% 95% at 50% 40%, #15110d 0%, #0b0a0c 58%, #07070a 100%)" }}>
        {/* Зал */}
        <div ref={videoWrap} className="absolute inset-0 will-change-transform">
          <video ref={videoEl} className="h-full w-full object-cover" muted playsInline preload="auto" style={{ filter: "brightness(1.3) contrast(1.04) saturate(1.05)" }}>
            <source src={asset("/media/interior-hq.mp4")} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-base/30 via-base/5 to-base/70" />
        </div>

        {/* Затемнение фона во время пролёта */}
        <div ref={darkEl} className="pointer-events-none absolute inset-0 z-[5] bg-base" style={{ opacity: 0 }} />
        <div ref={glow} className="pointer-events-none absolute -left-48 -top-48 z-[2] h-96 w-96 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, rgba(168, 192, 62,0.30), transparent 60%)" }} />

        {/* Кнопки (город «Ставрополь» и подпись «Парикмахерская» убраны) */}
        <div ref={metaBot} className="absolute inset-x-0 top-[64%] z-[18] flex flex-col items-center px-6 text-center md:top-[73%]">
          <HeroCtas />
        </div>

        {/* Ножницы сквозь буквы — CSS-маска на КОНТЕЙНЕРЕ (Safari-safe), растёт только маска.
            Видео внутри в ТОМ ЖЕ масштабе (SCISSOR_SCALE), что и слой раскрытия ниже →
            при кросс-фейде ножницы не «прыгают» в размере. Белый фон контейнера = белый
            фон самого видео ножниц: поля вокруг scale(0.86) сливаются, «плашки» не видно. */}
        <div ref={clipEl} className="hero-text pointer-events-none absolute inset-0 z-20" style={{ ...maskStyle, background: "#ffffff" }}>
          <video ref={clipVid} className="h-full w-full object-cover scale-[0.86]" muted playsInline preload="auto">
            <source src={asset("/media/scissors-hq4.mp4")} type="video/mp4" />
          </video>
        </div>

        {/* Раскрытие: ПОЗАДИ букв (z-8). Белый фон во весь экран + ножницы в том же масштабе. */}
        <div ref={clipFull} className="pointer-events-none absolute inset-0 z-[8]" style={{ opacity: 0, background: "#ffffff" }}>
          <video ref={clipFullVid} className="h-full w-full object-cover scale-[0.86]" muted playsInline preload="auto">
            <source src={asset("/media/scissors-hq4.mp4")} type="video/mp4" />
          </video>
        </div>

        {/* Интро-затемнение на входе */}
        <motion.div className="pointer-events-none absolute inset-0 z-40 bg-base" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.3, ease, delay: 0.1 }} />

        <motion.div ref={cue} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.6 }} className="absolute inset-x-0 bottom-7 z-30 flex flex-col items-center gap-2 text-ink/50">
          <span className="text-[10px] uppercase tracking-brand">Листайте — проходим внутрь</span>
          <span className="h-9 w-px bg-gradient-to-b from-ink/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
