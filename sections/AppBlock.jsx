"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import ScrubVideo from "@/components/ScrubVideo";
import { BRAND } from "@/data/brand";
import { MediaReveal, ParallaxLayer, DividerReveal, LuxuryButton } from "@/components/anim";

const FEATURES = [
  "Запись в пару касаний — без звонков",
  "Личный кабинет: история визитов и услуги",
  "Maya всегда под рукой — запись и напоминания",
  "Бонусы, сертификаты и абонементы",
];

export default function AppBlock() {
  const [qr, setQr] = useState(null);
  useEffect(() => {
    QRCode.toDataURL(BRAND.appUrl, { margin: 1, width: 520, color: { dark: "#0A0A0D", light: "#F4F0EB" } }).then(setQr).catch(() => {});
  }, []);

  return (
    <section id="app" className="w-full px-6 py-24 md:px-10 md:py-36">
      <MediaReveal
        y={30}
        scale={0.98}
        duration={1.2}
        className="relative grid items-center gap-8 overflow-hidden rounded-[2rem] border border-line bg-panel/40 p-6 sm:p-8 md:grid-cols-2 md:gap-12 md:p-14 lg:grid-cols-[1fr_auto_1fr]"
      >
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, rgba(168, 192, 62,0.3), transparent 60%)" }} />

        <div className="relative">
          <p className="mb-5 text-[11px] uppercase tracking-brand text-maya">Приложение Malesthetic</p>
          <MediaReveal as="h2" y={24} scale={1} duration={1.1} delay={0.05} className="text-[1.5rem] font-extralight leading-[1.12] tracking-tight md:whitespace-nowrap md:text-[1.6rem] lg:whitespace-normal">
            <span className="text-maya">AI-Native</span> <span className="font-maya">Maya</span> <span className="text-ink/40">у вас в кармане</span>
          </MediaReveal>
          <DividerReveal className="mt-6 max-w-[7rem]" />
          <p className="mt-6 max-w-md text-base font-light leading-relaxed text-ink/60">
            Тот же цифровой администратор, что и на сайте — в приложении. Запись, кабинет, уход и магазин в одном месте.
          </p>
          <ul className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm font-light text-ink/75">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-maya" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row md:hidden">
            <LuxuryButton href={BRAND.appUrl} variant="ghost" className="w-full justify-center sm:w-auto sm:min-w-[230px]" icon={
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M17.05 12.04c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.23 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.02 2.29-1.27 3.15-2.53.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.73-1.05-2.76-4.15zM14.6 4.59c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.09 3.18 1.15.09 2.32-.58 3.04-1.45z" /></svg>
            }>Скачать PWA</LuxuryButton>
            <LuxuryButton href={BRAND.apkUrl} variant="ghost" className="w-full justify-center sm:w-auto sm:min-w-[230px]" icon={
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.62.62 0 00-.83.22l-1.88 3.24a11.5 11.5 0 00-9.46 0L5.13 5.67a.62.62 0 00-.83-.22c-.3.16-.42.54-.26.85L5.88 9.48C2.79 11.13.86 14.27.5 18h23c-.36-3.73-2.29-6.87-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" /></svg>
            }>Скачать Android APK</LuxuryButton>
          </div>
        </div>

        {/* iPhone — отдельная ЦЕНТРАЛЬНАЯ колонка (на lg строго по центру между текстом и QR) */}
        <ParallaxLayer speed={0.16} className="relative flex items-center justify-center">
          <MediaReveal y={36} scale={0.96} duration={1.2} delay={0.1} className="relative w-[230px] shrink-0 md:w-[270px]">
            {/* Размытая чёрная подложка чуть больше видео — растворяет край чёрного фона в панель */}
            <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 scale-[1.08] bg-black blur-2xl" />
            <ScrubVideo src="/media/phone-hq2.mp4" offset={0.5} className="relative aspect-[840/1744] w-full object-cover" />
          </MediaReveal>
        </ParallaxLayer>

        {/* QR — отдельная правая колонка (десктоп lg) */}
        <div className="hidden flex-col items-center justify-center lg:flex">
          <MediaReveal y={24} scale={0.94} duration={1.1} delay={0.18} className="rounded-2xl border border-line bg-panel/60 p-4 shadow-2xl">
            {qr ? <img src={qr} alt="QR-код приложения Maya" className="h-36 w-36" /> : <div className="h-36 w-36 animate-pulse rounded bg-base/20" />}
          </MediaReveal>
          <p className="mt-3 text-center text-[10px] uppercase tracking-wide2 text-ink/50">Наведите камеру</p>
        </div>
      </MediaReveal>
    </section>
  );
}
