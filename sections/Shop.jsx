"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CERTIFICATES, SUBSCRIPTIONS } from "@/data/shop";
import { useCart } from "@/features/cart/cart";
import { asset } from "@/lib/asset";

const ease = [0.16, 1, 0.3, 1];

// Кнопка добавления в корзину с короткой реакцией «Добавлено ✓»
function AddButton({ item, className, children }) {
  const { add } = useCart();
  const [hit, setHit] = useState(false);
  const onClick = () => {
    add(item);
    setHit(true);
    setTimeout(() => setHit(false), 1300);
  };
  return (
    <button onClick={onClick} className={className}>
      {hit ? "Добавлено ✓" : children}
    </button>
  );
}

// Карточка абонемента с выбором тарифа (старший / топ-мастер)
function SubCard({ s }) {
  const [tier, setTier] = useState("senior");
  const amount = s.prices[tier];
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-panel/40 p-7">
      <p className="text-[10px] uppercase tracking-wide2 text-gold/80">Абонемент · {s.visits} визита/мес</p>
      <h3 className="mt-2 text-2xl font-extralight tracking-tight">{s.title}</h3>
      <p className="mt-3 min-h-[3.5rem] text-[13px] font-light leading-relaxed text-ink/55">{s.desc}</p>

      <div className="mt-3 inline-flex self-start rounded-full border border-line p-0.5">
        {[["senior", "Старший"], ["top", "Топ-мастер"]].map(([k, label]) => (
          <button key={k} onClick={() => setTier(k)} className={`rounded-full px-3 py-1.5 text-[11px] uppercase tracking-wide2 transition-colors ${tier === k ? "bg-ink text-base" : "text-ink/55 hover:text-ink"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 border-t border-line pt-4">
        <p className="text-2xl font-extralight">{amount.toLocaleString("ru")} ₽<span className="text-base text-ink/50"> /мес</span></p>
      </div>

      <AddButton
        item={{ id: `sub-${s.title}-${tier}`, kind: "sub", label: `Абонемент «${s.title}» · ${tier === "top" ? "топ" : "старший"}`, amount, plan: s.title, tier }}
        className="btn-fill mt-5 rounded-full py-3 text-[11px] uppercase tracking-wide2"
      >
        В корзину
      </AddButton>
    </div>
  );
}

export default function Shop() {
  const [cat, setCat] = useState("cert");

  return (
    <section id="shop" className="w-full px-6 py-24 md:px-10 md:py-36">
      <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.8, ease }} className="mb-5 text-[11px] uppercase tracking-brand text-gold/80">
        Магазин
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.9, ease }} className="max-w-2xl text-balance text-3xl font-extralight leading-[1.12] tracking-tight md:text-[2.75rem]">
        Сертификаты <span className="text-ink/40">и абонементы</span>
      </motion.h2>

      <div className="mt-9 inline-flex rounded-full border border-line p-1">
        {[["cert", "Сертификаты"], ["sub", "Абонементы"]].map(([k, label]) => (
          <button key={k} onClick={() => setCat(k)} className={`rounded-full px-5 py-2 text-[12px] uppercase tracking-wide2 transition-colors duration-300 ${cat === k ? "bg-ink text-base" : "text-ink/60 hover:text-ink"}`}>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {cat === "cert" ? (
          <motion.div key="cert" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease }} className="mt-10 grid gap-6 md:grid-cols-3">
            {CERTIFICATES.map((c) => (
              <div key={c.amount} className="flex flex-col gap-3">
                <div className="flip-card aspect-[1.66/1]">
                  <div className="flip-inner">
                    <img src={asset(c.front)} alt={`Сертификат ${c.amount.toLocaleString("ru")} ₽`} className="flip-face object-cover shadow-xl" />
                    <img src={asset(c.back)} alt="" className="flip-face flip-back object-cover shadow-xl" />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 px-1">
                  <span className="text-[12px] font-light text-ink/55">{c.note}</span>
                  <AddButton
                    item={{ id: `cert-${c.amount}`, kind: "cert", label: `Сертификат ${c.amount.toLocaleString("ru")} ₽`, amount: c.amount }}
                    className="btn-fill shrink-0 rounded-full px-5 py-2 text-[11px] uppercase tracking-wide2"
                  >
                    В корзину
                  </AddButton>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease }} className="mt-10 grid gap-4 md:grid-cols-3">
            {SUBSCRIPTIONS.map((s) => <SubCard key={s.title} s={s} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
