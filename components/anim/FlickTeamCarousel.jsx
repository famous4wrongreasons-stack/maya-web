"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "./gsap";

// Перетаскиваемая карусель команды с «флик»-инерцией (момент по скорости) + снап,
// стрелки prev/next. Без платных плагинов — момент считаем вручную.
export default function FlickTeamCarousel({ members = [], className = "" }) {
  const viewport = useRef(null);
  const track = useRef(null);
  const st = useRef({ x: 0, startX: 0, startTrackX: 0, dragging: false, lastX: 0, lastT: 0, v: 0, min: 0, max: 0, step: 1 });
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(1);

  useEffect(() => {
    const vp = viewport.current, tr = track.current;
    if (!vp || !tr) return;
    const s = st.current;
    const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

    const measure = () => {
      const first = tr.children[0];
      const cardW = first ? first.getBoundingClientRect().width : 0;
      const gap = parseFloat(getComputedStyle(tr).columnGap || "0") || 0;
      s.step = cardW + gap || 1;
      s.min = Math.min(0, vp.clientWidth - tr.scrollWidth);
      s.max = 0;
      s.x = gsap.utils.clamp(s.min, s.max, s.x);
      gsap.set(tr, { x: s.x });
      setCount(Math.max(1, Math.round((s.max - s.min) / s.step) + 1));
    };
    measure();
    window.addEventListener("resize", measure);

    const clampX = (x) => gsap.utils.clamp(s.min, s.max, x);
    const snap = (x) => clampX(Math.round(x / s.step) * s.step);
    const idxFromX = (x) => setIdx(Math.max(0, Math.min(members.length - 1, Math.round(-x / s.step))));

    const onDown = (e) => {
      s.dragging = true; s.startX = e.clientX; s.startTrackX = s.x; s.lastX = e.clientX; s.lastT = now(); s.v = 0;
      gsap.killTweensOf(tr); vp.classList.add("is-grabbing");
      try { vp.setPointerCapture(e.pointerId); } catch (_) {}
    };
    const onMove = (e) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.startX;
      let nx = s.startTrackX + dx;
      if (nx > s.max) nx = s.max + (nx - s.max) * 0.35;   // резинка за краями
      if (nx < s.min) nx = s.min + (nx - s.min) * 0.35;
      s.x = nx; gsap.set(tr, { x: nx });
      const t = now(), dt = t - s.lastT;
      if (dt > 0) s.v = (e.clientX - s.lastX) / dt;
      s.lastX = e.clientX; s.lastT = t;
    };
    const onUp = () => {
      if (!s.dragging) return;
      s.dragging = false; vp.classList.remove("is-grabbing");
      const target = snap(s.x + s.v * 180);             // момент по скорости
      gsap.to(tr, { x: target, duration: 0.9, ease: "power3.out", onUpdate: () => { s.x = gsap.getProperty(tr, "x"); }, onComplete: () => { s.x = target; idxFromX(target); } });
      idxFromX(target);
    };

    vp.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("resize", measure);
      vp.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [members]);

  const go = (dir) => {
    const tr = track.current, s = st.current;
    if (!tr) return;
    const target = gsap.utils.clamp(s.min, s.max, Math.round((s.x - dir * s.step) / s.step) * s.step);
    gsap.killTweensOf(tr);
    gsap.to(tr, { x: target, duration: 0.7, ease: "power3.out", onUpdate: () => { s.x = gsap.getProperty(tr, "x"); }, onComplete: () => { s.x = target; setIdx(Math.max(0, Math.min(members.length - 1, Math.round(-target / s.step)))); } });
  };

  return (
    <div className={className}>
      <div ref={viewport} className="flick-vp cursor-grab overflow-hidden">
        <div ref={track} className="flex gap-5 select-none" style={{ touchAction: "pan-y" }}>
          {members.map((m, i) => (
            <figure key={i} className="w-[78%] flex-none sm:w-[46%] md:w-[32%] lg:w-[24%]">
              <div className="overflow-hidden rounded-[1.3rem]" style={{ aspectRatio: "3 / 4", border: "1px solid var(--line)" }}>
                <img src={m.image} alt={m.name} draggable="false" className="pointer-events-none h-full w-full object-cover" style={{ filter: "grayscale(0.4) contrast(1.04) sepia(0.06)" }} />
              </div>
              <figcaption className="mt-4">
                <span className="font-display block text-xl" style={{ color: "var(--ink)" }}>{m.name}</span>
                <span className="block text-[12px] uppercase tracking-[0.2em]" style={{ color: "var(--teal)" }}>{m.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button aria-label="Назад" onClick={() => go(-1)} className="flick-arrow">←</button>
        <button aria-label="Вперёд" onClick={() => go(1)} className="flick-arrow">→</button>
        <div className="ml-2 flex-1" style={{ height: 1, background: "var(--line)" }}>
          <div style={{ height: "100%", width: `${((idx + 1) / Math.max(1, members.length)) * 100}%`, background: "var(--teal)", transition: "width .5s cubic-bezier(0.16,1,0.3,1)" }} />
        </div>
        <span className="text-[12px] tabular-nums" style={{ color: "var(--body)" }}>
          {String(idx + 1).padStart(2, "0")} / {String(members.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
