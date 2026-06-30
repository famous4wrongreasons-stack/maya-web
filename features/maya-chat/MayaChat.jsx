"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { streamMaya } from "@/lib/api/maya";
import { QUICK_PROMPTS } from "@/data/brand";
import RealtimeVoice from "@/features/voice-assistant/RealtimeVoice";
import { useAuth, TelegramLogin } from "@/features/auth/auth";

const ease = [0.16, 1, 0.3, 1];

// Озвучка ответа в голосовом режиме (браузерный синтез речи)
function speak(text) {
  try {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ru-RU";
    u.rate = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) {}
}

function Orb({ size = 26 }) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      <span className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 16px 2px rgba(61, 139, 240,0.55)" }} />
      <span className="absolute inset-0 overflow-hidden rounded-full" style={{ animation: "orbShimmer 6s ease-in-out infinite" }}>
        <span className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 40% 34%, #dbeaff, #3d8bf0 54%, #1e5fd0 100%)" }} />
        <span className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.95), rgba(255,255,255,0) 45%)", animation: "orbDrift 4.5s ease-in-out infinite" }} />
      </span>
    </span>
  );
}

export default function MayaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [voice, setVoice] = useState(false);
  const { user, ready: authReady } = useAuth();
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  const send = useCallback(async (text, opts = {}) => {
    const content = (text ?? "").trim();
    if (!content || streaming) return;
    if (!user) { setOpen(true); return; } // нет входа — снизу покажется баннер входа
    setInput("");
    setMessages((m) => [...m, { role: "user", content }, { role: "assistant", content: "" }]);
    setStreaming(true);
    scrollDown();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    let full = "";
    try {
      for await (const tk of streamMaya(content, { signal: ctrl.signal, auth: user })) {
        full += tk;
        setMessages((m) => {
          const next = m.slice();
          next[next.length - 1] = { role: "assistant", content: next[next.length - 1].content + tk };
          return next;
        });
        scrollDown();
      }
      if (opts.spoken && full.trim()) speak(full);
    } catch (e) {
      setMessages((m) => {
        const next = m.slice();
        next[next.length - 1] = {
          role: "assistant",
          content: e?.code === "auth_required"
            ? "Войдите через Telegram внизу — и я отвечу по-настоящему."
            : "Нет связи с Maya. Попробуйте ещё раз чуть позже.",
        };
        return next;
      });
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [streaming, scrollDown, user]);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  // Внешнее открытие (из Hero, CTA и т.д.)
  useEffect(() => {
    const onOpen = (e) => {
      setOpen(true);
      const preset = e.detail?.preset;
      if (preset) setTimeout(() => send(preset), 450);
      else setTimeout(() => inputRef.current?.focus(), 350);
    };
    window.addEventListener("maya:open", onOpen);
    return () => window.removeEventListener("maya:open", onOpen);
  }, [send]);

  const empty = messages.length === 0;

  return (
    <>
      {/* Лаунчер */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.5, ease }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-line bg-panel py-2.5 pl-3 pr-5 text-ink shadow-2xl transition-transform duration-300 hover:scale-[1.03] md:bottom-7 md:right-7"
            aria-label="Открыть Maya"
          >
            <Orb size={30} />
            <span className="flex flex-col items-start leading-tight">
              <span className="font-maya text-[15px] leading-none">Maya</span>
              <span className="mt-1 text-[9px] uppercase tracking-wide2 text-ink/45">Цифровой администратор</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Панель чата */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.45, ease }}
            className="glass fixed z-50 flex flex-col overflow-hidden rounded-t-3xl shadow-2xl
                       inset-x-0 bottom-0 h-[88svh] rounded-b-none
                       md:inset-x-auto md:bottom-7 md:right-7 md:h-[600px] md:w-[400px] md:rounded-3xl"
          >
            {/* Шапка */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-3">
                <Orb size={30} />
                <div className="flex flex-col">
                  <span className="font-maya text-[16px] leading-none">Maya</span>
                  <span className="mt-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wide2 text-ink/45">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" /> онлайн
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { if (user) setVoice(true); }} aria-label="Голосовой режим" title={user ? "Голосовой режим" : "Войдите, чтобы говорить голосом"} className={`rounded-full p-2 transition-colors hover:bg-ink/5 ${user ? "text-ink/55 hover:text-ink" : "text-ink/25"}`}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
                </button>
                <button onClick={() => setOpen(false)} aria-label="Закрыть" className="rounded-full p-2 text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
                </button>
              </div>
            </div>

            {/* Сообщения */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {empty ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Orb size={48} />
                  <p className="mt-5 max-w-[16rem] text-sm font-light leading-relaxed text-ink/70">
                    Здравствуйте. Я Maya — помогу записаться и расскажу об услугах, мастерах и свободных окнах. С чего начнём?
                  </p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div className={
                      m.role === "user"
                        ? "max-w-[82%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm leading-relaxed text-base"
                        : "max-w-[88%] rounded-2xl rounded-bl-md bg-ink/[0.06] px-4 py-2.5 text-sm font-light leading-relaxed text-ink/90"
                    }>
                      {m.content || <TypingDots />}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Быстрые подсказки */}
            {empty && (
              <div className="flex flex-wrap gap-2 px-5 pb-3">
                {QUICK_PROMPTS.map((q) => (
                  <button key={q} onClick={() => send(q)} className="rounded-full border border-line px-3.5 py-1.5 text-[11px] text-ink/70 transition-colors hover:border-gold/50 hover:text-ink">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Композер / баннер входа */}
            {authReady && !user ? (
              <div className="border-t border-line p-4">
                <p className="text-[13px] font-light leading-relaxed text-ink/70">
                  Войдите через Telegram, чтобы поговорить с <span className="font-maya text-maya">Maya</span> по-настоящему.
                </p>
                <div className="mt-3"><TelegramLogin /></div>
                <p className="mt-2 text-[10px] uppercase tracking-wide2 text-ink/30">Вход работает на боевом домене сайта</p>
              </div>
            ) : (
              <div className="border-t border-line p-3">
                <div className="flex items-end gap-2 rounded-2xl bg-ink/[0.05] px-3 py-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                    rows={1}
                    placeholder="Спросите Maya…"
                    className="max-h-28 flex-1 resize-none bg-transparent text-sm font-light text-ink placeholder:text-ink/35 focus:outline-none"
                  />
                  {streaming ? (
                    <button onClick={stop} aria-label="Остановить" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink transition hover:bg-ink/15">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
                    </button>
                  ) : (
                    <button onClick={() => send(input)} disabled={!input.trim()} aria-label="Отправить" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maya text-base transition disabled:opacity-30">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11l5-5 5 5M12 6v12"/></svg>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Живой голосовой режим (дуплекс, как в приложении) */}
            <AnimatePresence>
              {voice && user && (
                <RealtimeVoice
                  auth={user}
                  onClose={() => setVoice(false)}
                  onMessage={(msg) => { setMessages((m) => [...m, msg]); scrollDown(); }}
                  onFallback={() => {
                    setVoice(false);
                    setMessages((m) => [...m, { role: "assistant", content: "Голос сейчас недоступен — напишите мне текстом, я отвечу." }]);
                    scrollDown();
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-ink/50" style={{ animation: "breathe 1s ease-in-out infinite", animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}
