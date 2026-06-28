"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Реальный голосовой ввод через Web Speech API (webkitSpeechRecognition).
// Работает в Chrome/Edge/Safari на https и localhost. Речь → текст → onResult.
// TTS-ответ озвучивает сам чат (SpeechSynthesis) после получения реплики.
const LABELS = {
  listening: "Говорите…",
  thinking: "Распознаю…",
  unsupported: "Голос не поддерживается",
  error: "Не расслышала",
};

export default function VoiceOrb({ onClose, onResult }) {
  const [phase, setPhase] = useState("listening");
  const [text, setText] = useState("");
  const recRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) { setPhase("unsupported"); return; }

    const rec = new SR();
    rec.lang = "ru-RU";
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    recRef.current = rec;

    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setText(finalText || interim);
    };
    rec.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      setPhase("error");
    };
    rec.onend = () => {
      if (doneRef.current) return;
      const t = (finalText || "").trim();
      if (t) { doneRef.current = true; setPhase("thinking"); setTimeout(() => onResult?.(t), 300); }
      else setPhase("error");
    };

    try { rec.start(); } catch (e) {}
    return () => { try { doneRef.current = true; rec.stop(); } catch (e) {} };
  }, [onResult]);

  const finish = () => { try { recRef.current?.stop(); } catch (e) {} };
  const active = phase === "listening";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-7 bg-base/90 px-6 backdrop-blur-xl"
    >
      <button onClick={onClose} aria-label="Закрыть голос" className="absolute right-4 top-4 rounded-full p-2 text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      {/* Орб */}
      <motion.div
        animate={{ scale: phase === "thinking" ? [1, 1.06, 1] : 1 }}
        transition={{ duration: 1.1, repeat: phase === "thinking" ? Infinity : 0, ease: "easeInOut" }}
        className="relative h-32 w-32"
      >
        <span className="absolute inset-0 rounded-full blur-2xl animate-breathe" style={{ background: "radial-gradient(circle at 38% 32%, #dbeaff, #3d8bf0 55%, rgba(61, 139, 240,0) 75%)" }} />
        <span className="absolute inset-6 rounded-full" style={{ background: "radial-gradient(circle at 40% 35%, #fff, #3d8bf0 70%)", boxShadow: "0 0 60px 10px rgba(61, 139, 240,0.5)" }} />
      </motion.div>

      {/* Волна */}
      <div className="flex h-10 items-end gap-1.5">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <span key={i} className="w-1 rounded-full bg-maya/80" style={{ height: active ? undefined : "6px", animation: active ? "voiceBar 0.9s ease-in-out infinite" : "none", animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>

      {/* Распознанный текст */}
      {(phase === "listening" || phase === "thinking") && text && (
        <p className="max-w-[18rem] text-center text-sm font-light leading-relaxed text-ink/85">{text}</p>
      )}

      <div className="text-center">
        <p className="text-sm tracking-wide2 text-ink/85">{LABELS[phase]}</p>
        {phase === "listening" && <p className="mt-2 text-[10px] uppercase tracking-wide2 text-ink/35">Говорите и нажмите «Готово»</p>}
        {phase === "unsupported" && <p className="mt-2 max-w-[16rem] text-[12px] font-light text-ink/45">Откройте сайт в Chrome или Safari — там доступен голосовой ввод.</p>}
        {phase === "error" && <p className="mt-2 text-[12px] font-light text-ink/45">Попробуйте ещё раз.</p>}
      </div>

      {/* Действия */}
      {phase === "listening" && (
        <button onClick={finish} className="rounded-full btn-fill px-7 py-2.5 text-[11px] uppercase tracking-wide2">Готово</button>
      )}
      {(phase === "unsupported" || phase === "error") && (
        <button onClick={onClose} className="rounded-full border border-line px-7 py-2.5 text-[11px] uppercase tracking-wide2 text-ink/80 transition hover:text-ink">Закрыть</button>
      )}

      <style jsx>{`
        @keyframes voiceBar {
          0%, 100% { height: 8px; }
          50% { height: 34px; }
        }
      `}</style>
    </motion.div>
  );
}
