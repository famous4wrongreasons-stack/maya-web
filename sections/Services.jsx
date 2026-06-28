"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES } from "@/data/services";
import { MediaReveal, DividerReveal, SvgDrawLine } from "@/components/anim";

const ease = [0.16, 1, 0.3, 1];
const openMaya = (preset) => window.dispatchEvent(new CustomEvent("maya:open", { detail: { preset } }));

export default function Services() {
  const [open, setOpen] = useState(0);

  return (
    <section id="services" className="mx-auto max-w-5xl px-6 pt-4 pb-28 md:py-40">
      <MediaReveal as="div" y={18} scale={1} duration={0.9}>
        <p className="mb-5 text-center text-[11px] uppercase tracking-brand text-gold/80 md:text-left">
          Услуги
        </p>
      </MediaReveal>

      <MediaReveal as="div" y={26} scale={0.98} duration={1.1} delay={0.08}>
        <h2 className="mx-auto max-w-2xl text-balance text-center text-3xl font-extralight leading-[1.12] tracking-tight md:mx-0 md:text-left md:text-[2.75rem]">
          Точность <span className="text-ink/40">в каждой детали</span>
        </h2>
        <div className="relative mt-6 flex justify-center md:justify-start">
          <SvgDrawLine
            d="M2 10 C 60 2, 120 18, 220 8"
            viewBox="0 0 224 20"
            className="h-5 w-40"
            stroke="var(--gold, #c9a14a)"
            strokeWidth={1.5}
            duration={1.4}
            delay={0.35}
          />
        </div>
      </MediaReveal>

      <MediaReveal as="div" y={28} scale={1} duration={1} delay={0.16}>
        <DividerReveal className="mt-14" color="var(--maya)" thickness={1} />
        <ul>
          {SERVICES.map((s, i) => {
            const isOpen = open === i;
            return (
              <MediaReveal
                key={s.name}
                as="li"
                y={22}
                scale={1}
                duration={0.85}
                delay={Math.min(i, 6) * 0.06}
                className="border-b border-line"
              >
                <button onClick={() => setOpen(isOpen ? -1 : i)} className="group flex w-full items-start justify-between gap-4 py-6 text-left md:items-center md:gap-6 md:py-7">
                  <span className="flex items-center gap-4">
                    <span className={`text-[10px] tabular-nums transition-colors duration-300 ${isOpen ? "text-gold" : "text-ink/30"}`}>0{i + 1}</span>
                    <span className={`text-xl font-light tracking-tight transition-colors duration-300 md:text-[1.9rem] ${isOpen ? "text-ink" : "text-ink/80 group-hover:text-ink"}`}>{s.name}</span>
                  </span>
                  <span className="flex items-center gap-5">
                    <span className={`shrink-0 text-sm transition-colors duration-300 ${isOpen ? "text-gold" : "text-ink/45 group-hover:text-ink/70"}`}>{s.price}</span>
                    <span className={`text-lg font-light text-ink/40 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
                      <div className="flex flex-col items-start gap-4 pb-7 pl-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:pl-9">
                        <p className="max-w-xl text-sm font-light leading-relaxed text-ink/55">{s.desc}</p>
                        <button onClick={() => openMaya(`Расскажи про услугу: ${s.name}`)} className="text-[11px] uppercase tracking-wide2 text-maya/90 underline-offset-4 transition hover:underline">
                          Спросить Maya →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </MediaReveal>
            );
          })}
        </ul>
      </MediaReveal>
    </section>
  );
}
