"use client";

import MediaReveal from "./MediaReveal";
import SvgDrawLine from "./SvgDrawLine";

// Карточки отзывов: media-reveal со stagger по индексу + рисуемая линия-кавычка.
export default function ReviewCards({ reviews = [], className = "" }) {
  return (
    <div className={`grid gap-6 md:grid-cols-3 ${className}`}>
      {reviews.map((r, i) => (
        <MediaReveal key={i} delay={i * 0.12} start="top 92%">
          <figure
            className="flex h-full flex-col rounded-[1.4rem] p-8"
            style={{ background: "var(--card)", border: "1px solid var(--line)" }}
          >
            <SvgDrawLine
              d="M6 30 C6 14 18 8 30 8 M40 30 C40 14 52 8 64 8"
              viewBox="0 0 70 38"
              className="h-6 w-12"
              stroke="var(--teal)"
              strokeWidth={2}
              duration={1.2}
              delay={i * 0.12 + 0.2}
            />
            <blockquote className="mt-6 flex-1 text-[15px] leading-relaxed" style={{ color: "var(--ink)" }}>
              {r.text}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3">
              <span
                className="font-display grid h-11 w-11 place-items-center rounded-full text-sm"
                style={{ background: "var(--teal)", color: "#fff" }}
              >
                {r.name?.[0] || "—"}
              </span>
              <span>
                <span className="block text-sm font-medium" style={{ color: "var(--ink)" }}>{r.name}</span>
                <span className="block text-[12px]" style={{ color: "var(--body)" }}>{r.meta}</span>
              </span>
            </figcaption>
          </figure>
        </MediaReveal>
      ))}
    </div>
  );
}
