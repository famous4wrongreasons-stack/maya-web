"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { asset } from "@/lib/asset";

// Общая карточка-баннер «Подарок»: фото + slide-to-unlock → −20% + промокод.
// Полноэкранно на мобиле, аккуратное окно-карточка на десктопе. Один и тот же
// вид для стартового и exit-баннера — отличается только фото/текстом (пропсы).
const THRESHOLD = 0.85;

export default function GiftCard({
  photo,
  eyebrow = "Мужская Эстетика",
  title = "Подарок",
  subtitle,
  code = "MAYA20",
  onClose,
}) {
  const [revealed, setRevealed] = useState(false);
  const [x, setX] = useState(0);
  const trackRef = useRef(null);
  const knobRef = useRef(null);
  const dragging = useRef(false);

  const onDown = (e) => {
    if (revealed) return;
    dragging.current = true;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (er) {}
  };
  const onMove = (e) => {
    if (!dragging.current) return;
    const tr = trackRef.current, kn = knobRef.current;
    if (!tr || !kn) return;
    const rect = tr.getBoundingClientRect();
    const kw = kn.clientWidth;
    const max = rect.width - kw - 8;
    const nx = Math.max(0, Math.min(max, e.clientX - rect.left - kw / 2));
    setX(nx);
    if (nx >= max * THRESHOLD) {
      dragging.current = false;
      setX(max);
      try { navigator.vibrate?.(14); } catch (er) {}
      setRevealed(true);
    }
  };
  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (!revealed) setX(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black md:bg-base/90 md:p-6 md:backdrop-blur-sm"
    >
      <div className="relative h-[100svh] w-full overflow-hidden bg-black md:h-[620px] md:max-h-[88vh] md:w-[380px] md:rounded-3xl md:border md:border-line md:shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(photo)} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.5) 66%, #000 100%)" }} />

        <button onClick={onClose} aria-label="Закрыть" className="absolute right-5 top-[calc(env(safe-area-inset-top,0px)+1.25rem)] z-10 rounded-full bg-black/30 p-2 text-white/70 backdrop-blur-sm transition hover:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <div className="absolute inset-x-0 bottom-0 px-7 pb-[calc(env(safe-area-inset-bottom,0px)+2rem)] pt-10 text-center">
          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div key="offer" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <p className="text-[11px] uppercase tracking-brand text-white/55">{eyebrow}</p>
                <h3 className="mt-3 text-4xl font-extralight tracking-tight text-white">{title}</h3>
                {subtitle && <p className="mx-auto mt-3 max-w-xs text-[15px] font-light leading-relaxed text-white/70">{subtitle}</p>}

                <div ref={trackRef} className="relative mx-auto mt-8 h-16 w-full max-w-sm rounded-full border border-white/15 bg-white/10 backdrop-blur-sm">
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center pl-10 text-[11px] uppercase tracking-wide2 text-white/50 transition-opacity" style={{ opacity: x > 12 ? 0 : 1 }}>
                    Потяни, чтобы открыть
                  </span>
                  <button
                    ref={knobRef}
                    onPointerDown={onDown}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                    aria-label="Потяните, чтобы открыть подарок"
                    style={{ transform: `translateX(${x}px)`, transition: dragging.current ? "none" : "transform 0.25s" }}
                    className="absolute left-1 top-1 flex h-14 w-14 touch-none items-center justify-center rounded-full bg-white text-black shadow-lg"
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="reveal" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                <p className="text-[11px] uppercase tracking-brand text-white/55">Ваш подарок — первое посещение</p>
                <p className="mt-1 text-[4rem] font-extralight leading-none tracking-tight text-white">−20<span className="text-2xl align-top">%</span></p>
                <div className="mx-auto mt-4 inline-flex items-center gap-3 rounded-2xl border border-dashed border-white/35 bg-white/5 px-5 py-2.5">
                  <span className="text-[10px] uppercase tracking-wide2 text-white/50">Промокод</span>
                  <span className="text-xl font-medium tracking-[0.18em] text-white">{code}</span>
                </div>
                <p className="mx-auto mt-3 max-w-xs text-[13px] font-light leading-relaxed text-white/65">Назовите код мастеру при оплате.</p>
                <Link href="/booking" onClick={onClose} className="mx-auto mt-6 block w-full max-w-sm rounded-full bg-white py-4 text-center text-[11px] uppercase tracking-wide2 font-medium text-black transition-opacity hover:opacity-90">
                  Записаться
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={onClose} className="mt-5 text-[11px] uppercase tracking-wide2 text-white/35 transition hover:text-white/70">
            Не показывать
          </button>
        </div>
      </div>
    </motion.div>
  );
}
