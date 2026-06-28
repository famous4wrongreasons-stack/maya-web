"use client";

import { MAYA_SCENARIOS } from "@/data/brand";
import { MediaReveal, ParallaxLayer, DividerReveal, LuxuryButton } from "@/components/anim";
import HlsVideo from "@/components/HlsVideo";
import { asset } from "@/lib/asset";

const openMaya = (preset) => window.dispatchEvent(new CustomEvent("maya:open", { detail: { preset } }));

// Локальный mp4 вместо Mux-HLS (HLS в Safari подвисает и вешает кнопку Play).
const CLIP_SRC = asset("/media/maya-clipper.mp4");

export default function ConciergeTeaser() {
  return (
    <section id="maya" className="w-full px-6 pt-20 pb-2 md:py-44" style={{ background: "#000" }}>
      <div className="w-full md:px-6">
        <div className="grid items-center gap-8 md:grid-cols-[1.25fr_0.75fr] md:gap-12">
        <div className="text-center md:text-left">
          <MediaReveal as="p" y={20} scale={1} duration={0.9} className="mb-6 text-[11px] uppercase tracking-brand text-maya">
            AI-Native
          </MediaReveal>

          <MediaReveal as="h2" y={28} scale={0.98} duration={1.1} delay={0.05} className="mx-auto max-w-2xl text-balance text-3xl font-extralight leading-[1.14] tracking-tight md:mx-0 md:text-[2.6rem]">
            <span className="font-maya">Maya</span> ведёт вас <span className="text-ink/40">от вопроса</span> до кресла.
          </MediaReveal>

          <DividerReveal color="var(--maya)" className="mx-auto mt-7 w-24 md:mx-0" />

          <MediaReveal as="p" y={20} scale={1} duration={0.9} delay={0.1} className="mx-auto mt-7 max-w-xl text-[15px] font-light leading-relaxed text-ink/60 md:mx-0">
            Не виджет поддержки, а часть бренда. Подберёт стрижку под форму лица,
            предложит мастера, рассчитает стоимость, найдёт ближайшее окно и подскажет уход.
          </MediaReveal>

          <div className="mt-10 flex flex-wrap justify-center gap-2.5 md:justify-start">
            {MAYA_SCENARIOS.map((s, i) => (
              <MediaReveal key={s} y={16} scale={1} duration={0.8} delay={0.15 + i * 0.06}>
                <button onClick={() => openMaya(s)} className="rounded-full border border-line px-4 py-2.5 text-[13px] font-light text-ink/70 transition-colors duration-300 hover:border-ink/40 hover:text-white">
                  {s}
                </button>
              </MediaReveal>
            ))}
          </div>

          <MediaReveal y={16} scale={1} duration={0.85} delay={0.2} className="mt-12 flex justify-center md:justify-start">
            <LuxuryButton variant="fill" hologram noDiamond className="lux-mayabtn" onClick={() => openMaya()}>
              Открыть <span className="font-maya normal-case tracking-normal text-[13px]">Maya</span>
            </LuxuryButton>
          </MediaReveal>
        </div>

        <ParallaxLayer speed={0.18} className="flex w-full justify-center">
          <MediaReveal y={36} scale={0.9} duration={1.2} className="w-full">
            {/* Видео из Mux-потока: края растворяются прямо в чёрный фон блока (бесшовно).
                Safari (iOS) игнорирует mask-image на <video> → фейдим оверлеем с чёрным
                градиентом ПОВЕРХ видео (фон блока тоже #000 → шва не видно). */}
            <div className="relative mx-auto w-full max-w-md">
              <HlsVideo
                src={CLIP_SRC}
                className="h-full w-full object-cover"
                style={{ aspectRatio: "16 / 9" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(72% 66% at 50% 52%, transparent 16%, rgba(0,0,0,0.45) 46%, rgba(0,0,0,0.92) 78%, #000 92%)",
                }}
              />
              {/* Усиленный фейд верхней границы — растворяет верх видео в чёрный фон блока */}
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2" style={{ background: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.6) 35%, transparent 100%)" }} />
            </div>
          </MediaReveal>
        </ParallaxLayer>
        </div>
      </div>
    </section>
  );
}
