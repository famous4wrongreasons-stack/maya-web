"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { tgVerify } from "@/lib/api/proxy";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const KEY = "maya_auth";
const BOT = "malesthetic_bot"; // login-домен бота настраивается в @BotFather

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const r = localStorage.getItem(KEY); if (r) setUser(JSON.parse(r)); } catch (e) {}
    setReady(true);
  }, []);

  const login = (authData) => {
    setUser(authData);
    try { localStorage.setItem(KEY, JSON.stringify(authData)); } catch (e) {}
  };
  const logout = () => {
    setUser(null);
    try { localStorage.removeItem(KEY); } catch (e) {}
  };

  return <AuthCtx.Provider value={{ user, ready, login, logout }}>{children}</AuthCtx.Provider>;
}

// Кнопка Telegram Login Widget. Работает только на домене, прописанном боту
// в @BotFather (на localhost Telegram покажет «Bot domain invalid»).
export function TelegramLogin({ onDone, size = "medium" }) {
  const ref = useRef(null);
  const { login } = useAuth();

  useEffect(() => {
    window.onMayaTgAuth = async (tgUser) => {
      try {
        const d = await tgVerify(tgUser);
        if (d?.success) { login(tgUser); onDone && onDone(); }
      } catch (e) {}
    };

    const el = ref.current;
    if (el && !el.querySelector("script")) {
      const s = document.createElement("script");
      s.src = "https://telegram.org/js/telegram-widget.js?22";
      s.async = true;
      s.setAttribute("data-telegram-login", BOT);
      s.setAttribute("data-size", size);
      s.setAttribute("data-userpic", "false");
      s.setAttribute("data-radius", "16");
      s.setAttribute("data-request-access", "write");
      s.setAttribute("data-onauth", "onMayaTgAuth(user)");
      el.appendChild(s);
    }
    return () => {};
  }, []);

  return <div ref={ref} className="min-h-[40px]" />;
}

// Заметный контрол входа для шапки: «Войти» → поповер с виджетом Telegram,
// после входа — имя пользователя + «Выйти».
export function AccountControl({ className = "", full = false, onDone }) {
  const { user, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);
  if (!ready) return null;

  if (user) {
    if (full) {
      return (
        <div className={`flex items-center justify-center gap-3 py-2 ${className}`}>
          <span className="text-[13px] font-light text-ink/85">{user.first_name || "Вы"} · вы вошли</span>
          <button onClick={logout} className="text-[11px] uppercase tracking-wide2 text-ink/50 transition-colors hover:text-ink">Выйти</button>
        </div>
      );
    }
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-[11px] uppercase tracking-wide2 text-ink/75">{user.first_name || "Вы"}</span>
        <button onClick={logout} className="text-[10px] uppercase tracking-wide2 text-ink/40 transition-colors hover:text-ink">Выйти</button>
      </div>
    );
  }

  // Полноценный вход через Telegram (мобильное меню): видимая пилюля в стиле остальных
  // кнопок + НЕВИДИМЫЙ официальный Telegram-виджет поверх (ловит тап → реальная авторизация).
  if (full) {
    return (
      <div className={`tg-login relative w-full ${className}`}>
        <div className="pointer-events-none flex w-full items-center justify-center gap-2.5 rounded-full border border-line px-5 py-4 text-[12px] uppercase tracking-wide2 text-ink/90">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#3aa9e0" aria-hidden>
            <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
          </svg>
          Войти через <span className="font-light normal-case tracking-normal">Telegram</span>
        </div>
        <div className="tg-login-hit absolute inset-0 flex items-center justify-center overflow-hidden opacity-0">
          <TelegramLogin size="large" onDone={onDone} />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button onClick={() => setOpen((v) => !v)} className="btn-fill inline-flex h-7 w-[8.5rem] items-center justify-center rounded-full border border-ink/20 bg-ink/10 px-3 text-[10px] uppercase tracking-[0.08em] leading-none text-ink">
        Войти
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 rounded-2xl border border-line bg-panel p-4 shadow-2xl">
            <p className="mb-3 whitespace-nowrap text-[12px] font-light text-ink/70">Вход через Telegram</p>
            <TelegramLogin onDone={() => setOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
