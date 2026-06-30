"use client";

import { useState } from "react";
import BookButton from "@/components/BookButton";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedTextReveal, MediaReveal, ParallaxLayer, DividerReveal } from "@/components/anim";
import { HAIRCUTS, STYLES } from "@/data/catalogue";
import { asset } from "@/lib/asset";

const ease = [0.16, 1, 0.3, 1];
const openMaya = (p) => window.dispatchEvent(new CustomEvent("maya:open", { detail: { preset: p } }));

const variants = {
  enter: (d) => ({ x: d > 0 ? 90 : -90, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d > 0 ? -90 : 90, opacity: 0 }),
};

export default function Catalogue() {
  const [filter, setFilter] = useState("Все");
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(0);

  const items = filter === "Все" ? HAIRCUTS : HAIRCUTS.filter((h) => h.style === filter);
  const len = items.length;
  const i = ((page % len) + len) % len;
  const cur = items[i];

  const go = (d) => { setDir(d); setPage((p) => p + d); };
  const jump = (target) => { setDir(target > i ? 1 : -1); setPage(target); };
  const pick = (s) => { setFilter(s); setPage(0); setDir(0); };

  return (
    <section id="catalogue" className="mx-auto max-w-6xl px-6 py-28 md:py-40">
      <MediaReveal as="p" y={18} duration={0.9} className="mb-5 text-[11px] uppercase tracking-brand text-gold/80">
        Каталог стрижек
      </MediaReveal>
      <AnimatedTextReveal
        as="h2"
        text="Подберите дизайн под себя"
        stagger={0.08}
        duration={1.1}
        start="top 85%"
        className="mb-6 max-w-2xl text-balance text-3xl font-extralight leading-[1.12] tracking-tight md:text-[2.75rem]"
      />

      <DividerReveal color="var(--maya)" thickness={1} className="mb-10 max-w-[120px]" />

      <div className="mb-8 flex flex-wrap gap-2.5">
        {STYLES.map((s) => (
          <button key={s} onClick={() => pick(s)} className={`rounded-full border px-4 py-2.5 text-[12px] transition-colors duration-300 md:py-2 ${filter === s ? "border-maya/60 bg-gold/10 text-ink" : "border-line text-ink/60 hover:text-ink"}`}>
            {s}
          </button>
        ))}
      </div>

      <MediaReveal y={36} scale={0.97} duration={1.2} start="top 88%" className="overflow-hidden rounded-[2rem] border border-line bg-panel/30">
        <div className="grid md:grid-cols-2">
          {/* Разворот: фото */}
          <div className="relative aspect-square overflow-hidden md:aspect-auto md:min-h-[540px]">
            <ParallaxLayer speed={0.14} className="absolute inset-0">
              <AnimatePresence custom={dir} initial={false} mode="popLayout">
                <motion.img
                  key={cur.img} src={asset(cur.img)} alt={`Стрижка — ${cur.title}`}
                  custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease }}
                  drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
                  onDragEnd={(e, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
                  style={{ objectPosition: cur.pos === "top" ? "50% 24%" : "50% 45%" }}
                  className="absolute inset-0 h-full w-full cursor-grab object-cover active:cursor-grabbing"
                />
              </AnimatePresence>
            </ParallaxLayer>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/40 to-transparent md:bg-gradient-to-r" />
            <div className="absolute left-5 top-5 rounded-full bg-base/50 px-3 py-1 text-[11px] tracking-wide2 text-ink/85 backdrop-blur-sm">{i + 1} / {len}</div>
          </div>

          {/* Разворот: описание */}
          <div className="flex flex-col justify-center gap-6 p-6 md:p-12">
            <AnimatePresence custom={dir} mode="wait" initial={false}>
              <motion.div key={cur.title} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease }}>
                <p className="text-[11px] uppercase tracking-wide2 text-gold/80">{cur.style}</p>
                <h3 className="mt-2 text-3xl font-light tracking-tight md:text-4xl">{cur.title}</h3>
                <p className="mt-4 max-w-md text-base font-light leading-relaxed text-ink/65">{cur.desc}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button onClick={() => openMaya(`Расскажи про стрижку: ${cur.title}`)} className="w-full rounded-full btn-fill px-6 py-3 text-center text-[11px] uppercase tracking-wide2 text-[#07070A] transition hover:opacity-90 sm:w-auto">
                Спросить про стрижку
              </button>
              <BookButton iconSize={17} className="w-full rounded-full px-6 py-3 text-[11px] uppercase tracking-wide2 sm:w-auto" />
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <button onClick={() => go(-1)} aria-label="Назад" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink/70 transition hover:border-maya/50 hover:text-ink">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
              </button>
              <button onClick={() => go(1)} aria-label="Вперёд" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink/70 transition hover:border-maya/50 hover:text-ink">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
              </button>
              <span className="ml-1 text-[11px] uppercase tracking-wide2 text-ink/40">Листайте или свайпайте</span>
            </div>
          </div>
        </div>

        {/* Лента превью */}
        <div className="flex gap-2 overflow-x-auto border-t border-line p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((h, n) => (
            <button key={h.img} onClick={() => jump(n)} className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border transition ${n === i ? "border-maya" : "border-transparent opacity-45 hover:opacity-90"}`}>
              <img src={asset(h.img)} alt="" style={{ objectPosition: h.pos === "top" ? "50% 16%" : "50% 35%" }} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </MediaReveal>
    </section>
  );
}
