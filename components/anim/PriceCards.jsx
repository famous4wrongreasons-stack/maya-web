"use client";

import MediaReveal from "./MediaReveal";
import DividerReveal from "./DividerReveal";
import LuxuryButton from "./LuxuryButton";

// Карточки тарифов: featured-вариант с бирюзовой заливкой, media-reveal со stagger.
export default function PriceCards({ plans = [], className = "", onChoose }) {
  return (
    <div className={`grid gap-6 md:grid-cols-3 ${className}`}>
      {plans.map((p, i) => (
        <MediaReveal key={i} delay={i * 0.1} start="top 90%">
          <div
            className="flex h-full flex-col rounded-[1.6rem] p-9"
            style={
              p.featured
                ? { background: "var(--teal)", color: "#fff", boxShadow: "0 40px 80px -40px rgba(14,108,128,0.55)" }
                : { background: "var(--card)", border: "1px solid var(--line)", color: "var(--ink)" }
            }
          >
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-[0.28em]" style={{ color: p.featured ? "rgba(255,255,255,0.8)" : "var(--teal)" }}>
                {p.tier}
              </span>
              {p.featured ? <span className="lux-diamond" style={{ background: "#fff" }} aria-hidden /> : null}
            </div>

            <div className="font-display mt-6 flex items-end gap-1 text-5xl leading-none">
              {p.price}
              <span className="mb-1 text-sm font-normal" style={{ opacity: 0.7 }}>{p.unit}</span>
            </div>

            <DividerReveal className="mt-7" color={p.featured ? "rgba(255,255,255,0.4)" : "var(--line)"} thickness={1} />

            <ul className="mt-7 flex-1 space-y-3 text-[14px]" style={{ color: p.featured ? "rgba(255,255,255,0.92)" : "var(--body)" }}>
              {(p.features || []).map((f, j) => (
                <li key={j} className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rotate-45" style={{ background: p.featured ? "#fff" : "var(--teal)" }} />
                  {f}
                </li>
              ))}
            </ul>

            <LuxuryButton
              variant={p.featured ? "ghost" : "fill"}
              className="mt-9 self-start"
              onClick={() => onChoose?.(p)}
            >
              {p.cta || "Записаться"}
            </LuxuryButton>
          </div>
        </MediaReveal>
      ))}
    </div>
  );
}
