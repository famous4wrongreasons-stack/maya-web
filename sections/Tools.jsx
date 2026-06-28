"use client";

import { motion } from "framer-motion";
import ScrubVideo from "@/components/ScrubVideo";

const ease = [0.16, 1, 0.3, 1];

const FEATURES = [
  ["Точность", "Срез и линия выверены до миллиметра."],
  ["Стиль", "Форма под вашу геометрию, а не шаблон."],
  ["Уход", "Финиш и советы, которые держат форму."],
  ["Мастерство", "Опыт, отточенный на тысячах стрижек."],
];

function Block({ title, sub, video, reverse }) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.9, ease }}
        className={`overflow-hidden rounded-3xl border border-line ${reverse ? "md:order-2" : ""}`}
      >
        <ScrubVideo src={video} className="aspect-[4/3] w-full object-cover" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.9, ease, delay: 0.08 }}
        className={reverse ? "md:order-1" : ""}
      >
        <h3 className="text-3xl font-light tracking-tight md:text-4xl">{title}</h3>
        <p className="mt-4 max-w-md text-base font-light leading-relaxed text-ink/60">{sub}</p>
      </motion.div>
    </div>
  );
}

export default function Tools() {
  return (
    <section id="interior" className="mx-auto max-w-6xl px-6 py-28 md:py-40">
      <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.8, ease }} className="mb-5 text-[11px] uppercase tracking-brand text-gold/80">
        Атмосфера и инструмент
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.9, ease }} className="max-w-2xl text-balance text-4xl font-light leading-[1.1] tracking-tight md:text-5xl">
        Каждая деталь <span className="text-ink/40">— на месте</span>
      </motion.h2>

      <div className="mt-16 space-y-20 md:space-y-28">
        <Block title="Ножницы" sub="Архитектура формы: точность среза, текстура и баланс. Здесь рождается силуэт." video="/media/scissors-scrub.mp4" />
        <Block title="Машинка" sub="Чистая линия и фейд без переходов. Контур, выверенный до самого края." video="/media/clipper-scrub.mp4" reverse />
      </div>

      <div className="mt-20 grid grid-cols-2 overflow-hidden rounded-2xl border border-line md:grid-cols-4">
        {FEATURES.map(([t, d], i) => (
          <motion.div key={t} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease, delay: i * 0.08 }} className="border-line p-6 odd:border-r md:[&:not(:last-child)]:border-r">
            <p className="text-[11px] uppercase tracking-wide2 text-gold/80">{t}</p>
            <p className="mt-2 text-[13px] font-light leading-relaxed text-ink/55">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
