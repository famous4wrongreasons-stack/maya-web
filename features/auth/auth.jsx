"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { tgVerify } from "@/lib/api/proxy";
import ConsentCheckbox, { CONSENT_ERROR } from "@/components/ConsentCheckbox";

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

export function TelegramConsentLogin({ onDone, size = "medium" }) {
  const consentId = useId();
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="space-y-3">
      <ConsentCheckbox
        id={consentId}
        checked={agree}
        onChange={(next) => {
          setAgree(next);
          if (next) setError(null);
        }}
        error={error}
      />
      {agree ? (
        <TelegramLogin onDone={onDone} size={size} />
      ) : (
        <button
          type="button"
          onClick={() => setError(CONSENT_ERROR)}
          className="w-full rounded-full border border-line px-5 py-3 text-[11px] uppercase tracking-wide2 text-ink/45 transition hover:text-ink/70"
        >
          Подтвердите согласие для входа
        </button>
      )}
    </div>
  );
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
      <div className={`w-full ${className}`}>
        <TelegramConsentLogin size="large" onDone={onDone} />
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
            <TelegramConsentLogin onDone={() => setOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
