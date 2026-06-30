"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import BookButton from "@/components/BookButton";
import { AccountControl } from "@/features/auth/auth";
import { NAV } from "@/data/brand";

const openMaya = (preset) =>
  window.dispatchEvent(new CustomEvent("maya:open", { detail: { preset } }));

// Единая «жидкое стекло» пилюля: лого · меню · Записаться/Войти | Maya.
// • при скролле вниз задвигается вверх, при скролле вверх — возвращается;
// • плавно меняет тон (светлый/тёмный) в зависимости от фона под ней;
// • на мобиле меню скрыто в пилюле → гамбургер открывает полноэкранное меню.
export default function Nav() {
  const bar = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY, hidden = false, tone = "", raf2 = 0;
    const probeY = 44; // примерно центр пилюли по вертикали

    const setHidden = (h) => {
      if (h === hidden || !bar.current) return;
      hidden = h;
      bar.current.style.transform = h ? "translateY(-150%)" : "translateY(0)";
    };

    const tick = () => {
      raf2 = requestAnimationFrame(tick);
      const y = window.scrollY;
      const dy = y - lastY;
      if (y < 90) setHidden(false);
      else if (dy > 4) setHidden(true);
      else if (dy < -4) setHidden(false);
      if (Math.abs(dy) > 1) lastY = y;

      let t = "dark";
      const secs = document.querySelectorAll("[data-tone]");
      for (const s of secs) {
        const r = s.getBoundingClientRect();
        if (r.top <= probeY && r.bottom > probeY) t = s.getAttribute("data-tone") || "dark";
      }
      if (t !== tone) {
        tone = t;
        if (bar.current) bar.current.classList.toggle("nav-on-light", t === "light");
      }
    };
    raf2 = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf2);
  }, []);

  // открытое мобильное меню: блокируем скролл фона + закрытие по Esc
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const link = "rounded-full px-4 py-2 text-[11px] uppercase tracking-wide2 text-ink/60 transition-colors duration-300 hover:bg-white/5 hover:text-ink";

  return (
    <>
      <div
        ref={bar}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] md:px-6 md:pt-5"
      >
        <div className="glass-pill mx-auto flex w-full max-w-[84rem] items-center justify-between gap-3 rounded-full py-2 pl-5 pr-3 md:gap-6 md:pl-7 md:pr-7">
          {/* Лого в пилюле */}
          <Link href="/" aria-label="На главную" className="flex shrink-0 items-center gap-3">
            <Logo className="nav-logo h-6 w-6 text-ink/90" />
            <span className="block text-[10px] uppercase tracking-wide2 text-ink/70 md:hidden lg:block">Мужская&nbsp;Эстетика</span>
          </Link>

          {/* Меню (десктоп) */}
          <nav className="hidden items-center gap-2 md:flex">
            {NAV.map((n) =>
              n.href.startsWith("/") ? (
                <Link key={n.href} href={n.href} className={link}>{n.label}</Link>
              ) : (
                <a key={n.href} href={n.href} className={link}>{n.label}</a>
              )
            )}
          </nav>

          {/* Действия справа; меню (3 группы logo·nav·actions) встаёт по центру капсулы.
              Жёлтая «Записаться» — ТОЛЬКО на десктопе (md+); на мобиле её нет, она в выдвижном меню. */}
          <div className="flex shrink-0 items-center gap-2.5">
            {/* Обёртка: hidden на div работает, в отличие от .book-btn (его display перебивает hidden) */}
            <div className="hidden shrink-0 md:block">
              <BookButton iconSize={13} className="book-btn--flat h-7 w-[8.5rem] rounded-full px-3 text-[10px] uppercase tracking-[0.08em] leading-none" />
            </div>
            <div className="hidden sm:block"><AccountControl /></div>
            <span className="nav-divider mx-1.5 hidden h-4 w-px bg-white/15 sm:block" />
            <button onClick={() => openMaya()} aria-label="Открыть Maya" className="flex items-center gap-2 rounded-full border border-line px-3 py-2 transition-colors hover:bg-white/5 sm:border-0 sm:py-1.5">
              <span className="maya-orb-sm" />
              <span className="font-maya text-[12px] text-ink/85">Maya</span>
            </button>
            {/* Гамбургер — только мобайл */}
            <button onClick={() => setOpen(true)} aria-label="Меню" className="-mr-1 ml-0.5 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/5 md:hidden">
              <span className="relative block h-3 w-5">
                <span className="absolute left-0 top-0 block h-px w-full bg-current" />
                <span className="absolute left-0 top-1.5 block h-px w-full bg-current" />
                <span className="absolute left-0 top-3 block h-px w-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Полноэкранное мобильное меню */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-base/85 backdrop-blur-xl" onClick={() => setOpen(false)} />
          <div className="relative mx-auto flex h-full w-full max-w-md flex-col px-6 pb-12 pt-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3">
                <Logo className="h-6 w-6 text-ink/90" />
                <span className="text-[10px] uppercase tracking-wide2 text-ink/70">Мужская&nbsp;Эстетика</span>
              </span>
              <button onClick={() => setOpen(false)} aria-label="Закрыть" className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink/80">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
              {NAV.map((n) =>
                n.href.startsWith("/") ? (
                  <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-3xl font-light tracking-tight text-ink/85">{n.label}</Link>
                ) : (
                  <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-3xl font-light tracking-tight text-ink/85">{n.label}</a>
                )
              )}
            </nav>

            <div className="flex flex-col gap-3">
              <BookButton iconSize={18} onClick={() => setOpen(false)} className="rounded-full px-5 py-4 text-[12px] uppercase tracking-wide2" />
              <button onClick={() => { setOpen(false); openMaya("Хочу записаться или узнать про услуги"); }} className="flex items-center justify-center gap-2 rounded-full border border-line px-5 py-4 text-[12px] uppercase tracking-wide2 text-ink/90">
                <span className="maya-orb-sm" /> Спросить <span className="font-maya normal-case tracking-normal text-[13px]">Maya</span>
              </button>
              <AccountControl full onDone={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
