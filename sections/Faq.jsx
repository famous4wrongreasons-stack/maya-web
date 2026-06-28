"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedTextReveal, MediaReveal, DividerReveal } from "@/components/anim";
import { FAQ } from "@/data/faq";

const ease = [0.16, 1, 0.3, 1];

export default function Faq() {
  const [open, setOpen] = useState(-1);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-28 md:py-40">
      <AnimatedTextReveal
        as="p"
        text="Вопросы"
        className="mb-5 text-[11px] uppercase tracking-brand text-gold/80"
        stagger={0.08}
        duration={0.8}
        start="top 88%"
      />
      <MediaReveal as="div" y={28} duration={1.1} start="top 86%" delay={0.05}>
        <h2 className="text-balance text-3xl font-extralight leading-[1.12] tracking-tight md:text-[2.75rem]">
          Коротко <span className="text-ink/40">о важном</span>
        </h2>
      </MediaReveal>

      <ul className="mt-12 border-t border-line">
        {FAQ.map((f, i) => {
          const o = open === i;
          return (
            <li key={i} className="border-b border-line">
              <MediaReveal as="div" y={24} scale={1} duration={1} start="top 92%" delay={i * 0.07}>
                <button onClick={() => setOpen(o ? -1 : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left">
                  <span className={`text-lg font-light transition-colors ${o ? "text-ink" : "text-ink/80"}`}>{f.q}</span>
                  <span className={`text-lg text-ink/40 transition-transform duration-300 ${o ? "rotate-45" : ""}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {o && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                      <p className="max-w-2xl pb-6 text-sm font-light leading-relaxed text-ink/55">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </MediaReveal>
              {i < FAQ.length - 1 && <DividerReveal color="var(--maya)" thickness={1} />}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
