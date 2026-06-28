"use client";

import Logo from "@/components/Logo";
import { BRAND } from "@/data/brand";
import { MediaReveal, SvgDrawLine, DividerReveal, LuxuryButton } from "@/components/anim";

const openMaya = (p) => window.dispatchEvent(new CustomEvent("maya:open", { detail: { preset: p } }));

function StylizedMap() {
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <rect width="400" height="320" fill="#0a0a0d" />
        {/* кварталы */}
        <g fill="#f4f0eb" opacity="0.04">
          <rect x="20" y="30" width="120" height="70" /><rect x="160" y="20" width="90" height="55" />
          <rect x="270" y="40" width="110" height="80" /><rect x="30" y="130" width="80" height="80" />
          <rect x="200" y="120" width="70" height="60" /><rect x="60" y="235" width="110" height="60" />
          <rect x="285" y="200" width="95" height="95" />
        </g>
        {/* улицы */}
        <g stroke="#f4f0eb" strokeOpacity="0.10" fill="none">
          <path d="M0 110 H400" strokeWidth="6" />
          <path d="M0 190 H400" strokeWidth="3" />
          <path d="M150 0 V320" strokeWidth="6" />
          <path d="M280 0 V320" strokeWidth="3" />
          <path d="M0 40 L400 270" strokeWidth="4" strokeOpacity="0.07" />
          <path d="M40 0 V320" strokeWidth="1.5" /><path d="M340 0 V320" strokeWidth="1.5" />
          <path d="M0 250 H400" strokeWidth="1.5" />
        </g>
      </svg>
      {/* подсветка под точкой */}
      <div className="pointer-events-none absolute left-[37.5%] top-[34%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl" style={{ background: "radial-gradient(circle, rgba(168, 192, 62,0.4), transparent 65%)" }} />
      {/* пульсирующая синяя точка */}
      <div className="absolute left-[37.5%] top-[34%] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -inset-4 animate-ping rounded-full bg-maya/30" />
        <span className="absolute -inset-2 rounded-full bg-maya/20" />
        <span className="relative block h-3.5 w-3.5 rounded-full bg-maya shadow-[0_0_24px_7px_rgba(168, 192, 62,0.65)]" />
      </div>
      <div className="absolute left-[37.5%] top-[34%] ml-2 mt-2 flex max-w-[55%] items-center gap-2 rounded-lg border border-line bg-base/70 px-3 py-1.5 backdrop-blur-sm sm:ml-5 sm:max-w-none">
        <Logo className="h-3 w-3 text-ink/85" />
        <span className="text-[11px] tracking-wide2 text-ink/85">ул. Лермонтова, 343</span>
      </div>
    </div>
  );
}

export default function Contacts() {
  return (
    <section id="contacts" className="relative overflow-hidden px-6 py-28 md:py-40">
      <div className="relative w-full md:px-4">
        <MediaReveal as="p" y={18} scale={1} duration={0.9} className="mb-5 text-[11px] uppercase tracking-brand text-gold/80">
          Контакты
        </MediaReveal>
        <MediaReveal y={24} scale={1} duration={1.1} delay={0.08} className="text-balance text-3xl font-extralight leading-[1.12] tracking-tight md:text-[2.75rem]">
          <h2>
            Ждём вас <span className="text-ink/40">в студии</span>
          </h2>
        </MediaReveal>

        <div className="mt-6 max-w-xs">
          <SvgDrawLine
            d="M0 8 H180"
            viewBox="0 0 180 16"
            className="h-4 w-44"
            stroke="var(--gold)"
            strokeWidth={1.5}
            duration={1.1}
            delay={0.2}
          />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <MediaReveal y={28} duration={1.2} className="flex flex-col justify-between gap-10 rounded-[2rem] border border-line bg-panel/40 p-8 md:p-10">
            <div>
              <p className="text-[10px] uppercase tracking-wide2 text-ink/40">Адрес</p>
              <p className="mt-2 text-3xl font-extralight leading-tight tracking-tight sm:text-4xl md:text-5xl">ул. Лермонтова</p>
              <p className="text-3xl font-extralight leading-tight tracking-tight text-gold sm:text-4xl md:text-5xl">343</p>
              <p className="mt-2 text-ink/50">{BRAND.city}</p>
            </div>
            <DividerReveal color="var(--maya)" thickness={1} className="opacity-40" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-wide2 text-ink/40">Телефон</p>
                <a href={`tel:${BRAND.phoneRaw}`} className="mt-1.5 -my-2 inline-block py-2 font-light text-ink transition hover:text-maya">{BRAND.phone}</a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide2 text-ink/40">Часы</p>
                <p className="mt-1.5 font-light">{BRAND.hours}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide2 text-ink/40">Telegram</p>
                <a href={BRAND.telegram} target="_blank" rel="noreferrer" className="mt-1.5 -my-2 inline-block py-2 font-light text-ink underline-offset-4 transition hover:text-maya hover:underline">{BRAND.telegramHandle}</a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide2 text-ink/40">Рейтинг</p>
                <p className="mt-1.5 font-light">5.0 · Яндекс / 2ГИС</p>
              </div>
            </div>
            <LuxuryButton onClick={() => openMaya("Хочу записаться")} variant="fill" noDiamond className="lux-white flex w-full items-center justify-center gap-2.5 text-[11px] uppercase tracking-wide2 sm:w-auto">
              <span className="maya-orb-sm maya-orb-spin mr-2" />
              Запишись с помощью <span className="font-maya normal-case tracking-normal text-[12px]">Maya</span>
            </LuxuryButton>
          </MediaReveal>

          <MediaReveal y={28} duration={1.2} delay={0.12} className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-line bg-base">
            <StylizedMap />
            <div className="absolute inset-x-0 bottom-0 flex gap-2 p-4">
              <a href={BRAND.yandexMap} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-between rounded-xl border border-line bg-base/60 px-3 py-3 text-[11px] uppercase tracking-wide2 text-ink/80 backdrop-blur-sm transition hover:border-maya/50 hover:text-ink sm:px-4">
                Яндекс Карты <span className="text-ink/40">→</span>
              </a>
              <a href={BRAND.twogisMap} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-between rounded-xl border border-line bg-base/60 px-3 py-3 text-[11px] uppercase tracking-wide2 text-ink/80 backdrop-blur-sm transition hover:border-maya/50 hover:text-ink sm:px-4">
                2ГИС <span className="text-ink/40">→</span>
              </a>
            </div>
          </MediaReveal>
        </div>
      </div>
    </section>
  );
}
