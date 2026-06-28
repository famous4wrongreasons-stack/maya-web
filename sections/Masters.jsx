"use client";

import { useEffect, useRef, useState } from "react";
import BookButton from "@/components/BookButton";
import { MASTERS } from "@/data/masters";
import { asset } from "@/lib/asset";
import { AnimatedTextReveal, MediaReveal } from "@/components/anim";

const openMaya = (preset) => window.dispatchEvent(new CustomEvent("maya:open", { detail: { preset } }));
const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

function MasterCard({ m, i }) {
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const inViewRef = useRef(false);
  const vid = useRef(null);

  const sync = () => {
    const v = vid.current;
    if (!v) return;
    if (inViewRef.current && !activeRef.current) v.play().catch(() => {});
    else v.pause();
  };

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => { inViewRef.current = e.isIntersecting && e.intersectionRatio > 0.4; sync(); },
      { threshold: [0, 0.4, 1] }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const setBoth = (val) => { activeRef.current = val; setActive(val); sync(); };

  return (
    <MediaReveal
      delay={i * 0.08}
      className={`shrink-0 snap-center ${i % 2 ? "lg:translate-y-7" : ""}`}
    >
      <div
        onMouseEnter={() => setBoth(true)}
        onMouseLeave={() => setBoth(false)}
        onClick={() => { if (isTouch()) setBoth(!activeRef.current); }}
        className="group relative aspect-[3/4] w-[84vw] cursor-pointer overflow-hidden rounded-2xl bg-black sm:w-[360px] lg:w-[380px]"
      >
        <video ref={vid} className="h-full w-full object-cover" muted loop playsInline preload="metadata">
          <source src={asset(m.video)} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 94% 92% at 50% 42%, transparent 46%, #000 100%)" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />

        <div className={`absolute inset-x-0 bottom-0 p-6 transition-opacity duration-300 ${active ? "opacity-0" : "opacity-100"}`}>
          <p className="text-2xl font-light tracking-tight text-ink">{m.name}</p>
          <p className="mt-1.5 text-[11px] uppercase tracking-wide2 text-gold/80">{m.role}</p>
          <p className="mt-3 text-[10px] uppercase tracking-wide2 text-ink/40">Подробнее →</p>
        </div>

        {/* Навыки — сплошной фон (видео скрыто и на паузе), текст читаем */}
        <div className={`absolute inset-0 flex flex-col bg-base p-6 transition-opacity duration-400 ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <p className="text-xl font-light tracking-tight text-ink">{m.name}</p>
          <p className="text-[11px] uppercase tracking-wide2 text-gold/80">{m.role}</p>
          <div className="mt-5 space-y-3">
            {m.skills.map(([label, pct]) => (
              <div key={label}>
                <div className="flex justify-between text-[12px] text-ink/60"><span>{label}</span><span className="text-ink/85">{pct}%</span></div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-line pt-3 text-[12px]">
            <p className="text-ink/50">Любимые дизайны</p>
            <p className="mt-0.5 text-ink/85">{m.designs}</p>
            <div className="mt-2.5 flex items-center justify-between"><span className="text-ink/50">Занятость</span><span className="text-ink/85">{m.occupancy}%</span></div>
            <p className="mt-2 text-[10px] uppercase tracking-wide2 text-maya/85">{m.lead}</p>
          </div>
          <div className="mt-auto flex gap-2 pt-4">
            <BookButton iconSize={14} onClick={(e) => e.stopPropagation()} className="flex-1 rounded-full py-2.5 text-[10px] uppercase tracking-wide2" />
            <button onClick={(e) => { e.stopPropagation(); openMaya(`Расскажи про мастера: ${m.name}`); }} className="btn-fill rounded-full px-4 py-2.5 text-[10px] uppercase tracking-wide2">
              <span className="font-maya normal-case tracking-normal text-[12px]">Maya</span>
            </button>
          </div>
        </div>
      </div>
    </MediaReveal>
  );
}

export default function Masters() {
  return (
    <section id="masters" className="bg-black py-28 md:py-44" style={{ background: "#000" }}>
      <div className="px-6 md:px-10">
        <AnimatedTextReveal
          as="p"
          text="Команда"
          className="mb-5 text-[11px] uppercase tracking-brand text-gold/80"
          stagger={0.06}
          duration={0.8}
        />
        <MediaReveal as="h2" y={22} className="mb-3 max-w-2xl text-balance text-3xl font-extralight leading-[1.12] tracking-tight md:text-[2.75rem]">
          У каждого <span className="text-ink/40">свой почерк</span>
        </MediaReveal>
        <p className="mb-12 text-[11px] uppercase tracking-wide2 text-ink/40">Наведите — навыки мастера</p>
      </div>

      <div className="flex gap-5 overflow-x-auto px-6 pb-10 pt-2 [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden">
        {MASTERS.map((m, i) => <MasterCard key={m.name} m={m} i={i} />)}
      </div>
    </section>
  );
}
