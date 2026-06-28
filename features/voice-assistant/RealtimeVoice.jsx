"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Живой голос Maya по протоколу REALTIME_VOICE_CLIENT_PROTOCOL.md:
// микрофон PCM16 24kHz → WS wss://rt.malesthetic.pro/api/realtime, авторизация
// первым сообщением (тот же источник, что у текст-чата), приём бинарного аудио →
// gapless, события ready/transcript/reply_text/speaking_start/speaking_done/
// interrupted/error, полудуплекс (mute mic пока Maya говорит). Любой сбой WS →
// onFallback (откат на текст-чат), голос не роняет чат.
const RT_URL = "wss://rt.malesthetic.pro/api/realtime";

const ERR_MSG = {
  unauthorized: "Сессия не подтверждена",
  needs_consent: "Нужно согласие на обработку данных",
  realtime_disabled: "Голос временно отключён",
};

export default function RealtimeVoice({ auth, onClose, onMessage, onFallback }) {
  const [status, setStatus] = useState("Соединяю…");
  const [speaking, setSpeaking] = useState(false);
  const [fatal, setFatal] = useState(null);
  const R = useRef({ active: true, ready: false, ws: null, actx: null, outGain: null, stream: null, proc: null, sources: [], playHead: 0, micOn: false, muted: false });
  const authRef = useRef(auth);
  const onMsgRef = useRef(onMessage);
  const onFbRef = useRef(onFallback);
  authRef.current = auth;
  onMsgRef.current = onMessage;
  onFbRef.current = onFallback;

  useEffect(() => {
    const r = R.current;
    r.active = true;
    let connectTimeout;

    // Авторизация первым сообщением — тот же источник, что у текст-чата.
    const authMsg = () => {
      const m = { type: "auth" };
      try {
        if (typeof window !== "undefined" && window.Telegram?.WebApp?.initData) m.init_data = window.Telegram.WebApp.initData;
        else if (authRef.current) m.auth_data = authRef.current;
        else { const tok = localStorage.getItem("web_session_token"); if (tok) m.session_token = tok; }
      } catch (e) {}
      return m;
    };

    const stopPlayback = () => {
      try { (r.sources || []).forEach((s) => { try { s.stop(); } catch (e) {} }); } catch (e) {}
      r.sources = []; r.playHead = 0;
    };

    const play = (arrayBuf) => {
      const actx = r.actx;
      if (!actx) return;
      const i16 = new Int16Array(arrayBuf);
      if (!i16.length) return;
      const f32 = new Float32Array(i16.length);
      for (let i = 0; i < i16.length; i++) f32[i] = i16[i] / 32768;
      const buf = actx.createBuffer(1, f32.length, 24000);
      buf.getChannelData(0).set(f32);
      const node = actx.createBufferSource();
      node.buffer = buf; node.connect(r.outGain || actx.destination);
      const t = Math.max(actx.currentTime + 0.03, r.playHead || 0);
      node.start(t); r.playHead = t + buf.duration;
      r.sources = r.sources || []; r.sources.push(node);
      node.onended = () => { const i = r.sources.indexOf(node); if (i >= 0) r.sources.splice(i, 1); };
    };

    const stop = () => {
      r.active = false; r.micOn = false; r.ready = false;
      try { if (r.ws && r.ws.readyState === 1) r.ws.send(JSON.stringify({ type: "bye" })); } catch (e) {}
      try { if (r.ws) { r.ws.onmessage = r.ws.onclose = r.ws.onerror = null; r.ws.close(); } } catch (e) {}
      r.ws = null;
      try { if (r.proc) { r.proc.onaudioprocess = null; r.proc.disconnect(); } } catch (e) {}
      r.proc = null;
      stopPlayback();
      if (r.stream) { try { r.stream.getTracks().forEach((t) => t.stop()); } catch (e) {} r.stream = null; }
      if (r.actx) { try { r.actx.close(); } catch (e) {} r.actx = null; }
    };

    // Любой сбой → откат на текст-чат (если есть колбэк), иначе показать ошибку.
    const bail = (reason) => {
      if (!r.active) return;
      clearTimeout(connectTimeout);
      stop();
      if (onFbRef.current) onFbRef.current(reason);
      else setFatal(reason || "Голос недоступен");
    };

    const startMic = () => {
      try {
        const src = r.actx.createMediaStreamSource(r.stream);
        const proc = r.actx.createScriptProcessor(4096, 1, 1);
        const mute = r.actx.createGain(); mute.gain.value = 0;
        const inRate = r.actx.sampleRate;
        proc.onaudioprocess = (e) => {
          if (!r.active || !r.micOn || r.muted || !r.ws || r.ws.readyState !== 1) return;
          const input = e.inputBuffer.getChannelData(0);
          const ratio = inRate / 24000;
          let out;
          if (ratio <= 1.01) {
            out = new Int16Array(input.length);
            for (let i = 0; i < input.length; i++) { let v = input[i]; v = v < -1 ? -1 : v > 1 ? 1 : v; out[i] = v < 0 ? v * 0x8000 : v * 0x7FFF; }
          } else {
            const outLen = Math.floor(input.length / ratio);
            out = new Int16Array(outLen);
            for (let i = 0; i < outLen; i++) {
              const s = Math.floor(i * ratio), e2 = Math.min(input.length, Math.floor((i + 1) * ratio));
              let sum = 0, n = 0;
              for (let j = s; j < e2; j++) { sum += input[j]; n++; }
              let v = n ? sum / n : 0; v = v < -1 ? -1 : v > 1 ? 1 : v;
              out[i] = v < 0 ? v * 0x8000 : v * 0x7FFF;
            }
          }
          try { r.ws.send(out.buffer); } catch (er) {}
        };
        src.connect(proc); proc.connect(mute); mute.connect(r.actx.destination);
        r.proc = proc; r.micOn = true;
      } catch (e) { bail("Не удалось запустить микрофон"); }
    };

    const start = async () => {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC || !navigator.mediaDevices?.getUserMedia || !window.WebSocket) { bail("Браузер не поддерживает голос"); return; }
        try { r.actx = new AC({ sampleRate: 24000 }); } catch (e) { r.actx = new AC(); }
        try { await r.actx.resume(); } catch (e) {} // iOS: после жеста (тап «Говорить»)
        r.outGain = r.actx.createGain(); r.outGain.gain.value = 1; r.outGain.connect(r.actx.destination);
        r.sources = []; r.playHead = 0; r.muted = false;
        r.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
        if (!r.active) { stop(); return; }
      } catch (e) { bail("Нет доступа к микрофону"); return; }

      let ws;
      try { ws = new WebSocket(RT_URL); } catch (e) { bail("Не удалось соединиться"); return; }
      ws.binaryType = "arraybuffer";
      r.ws = ws;
      connectTimeout = setTimeout(() => { if (r.active && !r.ready) bail("Maya не отвечает"); }, 9000);

      ws.onopen = () => { try { ws.send(JSON.stringify(authMsg())); } catch (e) {} };
      ws.onerror = () => { if (!r.ready) bail("Связь не удалась"); };
      ws.onclose = () => { if (r.active) bail("Связь прервалась"); }; // и до, и после ready → фолбэк
      ws.onmessage = (ev) => {
        if (!r.active) return;
        if (typeof ev.data !== "string") { play(ev.data); return; }
        let m; try { m = JSON.parse(ev.data); } catch (e) { return; }
        if (m.type === "ready") {
          clearTimeout(connectTimeout);
          r.ready = true; setStatus("Слушаю…");
          startMic();
        } else if (m.type === "transcript") {
          if (m.text) onMsgRef.current?.({ role: "user", content: m.text });
          setStatus("Думаю…"); // ответ может идти 5–15с (Claude+YClients)
        } else if (m.type === "reply_text") {
          if (m.text) onMsgRef.current?.({ role: "assistant", content: m.text });
        } else if (m.type === "speaking_start") {
          r.muted = true; setSpeaking(true); setStatus("Maya говорит…");
        } else if (m.type === "speaking_done") {
          const actx = r.actx;
          const tail = actx ? Math.max(0, (r.playHead || 0) - actx.currentTime) + 0.35 : 0.35;
          setTimeout(() => { if (!r.active) return; r.muted = false; setSpeaking(false); setStatus("Слушаю…"); }, Math.round(tail * 1000));
        } else if (m.type === "interrupted") {
          stopPlayback(); r.muted = false; setSpeaking(false); setStatus("Слушаю…");
        } else if (m.type === "error") {
          bail(ERR_MSG[m.message] || m.message || "Связь прервалась");
        }
      };
    };

    start();
    return () => { clearTimeout(connectTimeout); stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listening = !speaking && !fatal && status === "Слушаю…";
  const thinking = !speaking && !fatal && status === "Думаю…";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-7 bg-base/92 px-6 backdrop-blur-xl"
    >
      <button onClick={onClose} aria-label="Завершить голос" className="absolute right-4 top-4 rounded-full p-2 text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      <motion.div
        animate={{ scale: speaking ? [1, 1.08, 1] : (listening || thinking) ? [1, 1.04, 1] : 1 }}
        transition={{ duration: speaking ? 0.9 : thinking ? 1.0 : 1.4, repeat: (speaking || listening || thinking) ? Infinity : 0, ease: "easeInOut" }}
        className="relative h-32 w-32"
      >
        <span className="absolute inset-0 rounded-full blur-2xl animate-breathe" style={{ background: "radial-gradient(circle at 38% 32%, #dbeaff, #3d8bf0 55%, rgba(61, 139, 240,0) 75%)" }} />
        <span className="absolute inset-6 rounded-full" style={{ background: "radial-gradient(circle at 40% 35%, #fff, #3d8bf0 70%)", boxShadow: "0 0 60px 10px rgba(61, 139, 240,0.5)" }} />
      </motion.div>

      {!fatal && (
        <div className="flex h-10 items-end gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} className="w-1 rounded-full bg-maya/80" style={{ height: listening ? undefined : "6px", animation: listening ? "voiceBar 0.9s ease-in-out infinite" : "none", animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      )}

      <div className="text-center">
        <p className="text-sm tracking-wide2 text-ink/85">{fatal || status}</p>
        {!fatal && <p className="mt-2 text-[10px] uppercase tracking-wide2 text-ink/35">Просто говорите — Maya слушает</p>}
      </div>

      {fatal && (
        <button onClick={onClose} className="rounded-full border border-line px-7 py-2.5 text-[11px] uppercase tracking-wide2 text-ink/80 transition hover:text-ink">Закрыть</button>
      )}

      <style jsx>{`
        @keyframes voiceBar { 0%, 100% { height: 8px; } 50% { height: 34px; } }
      `}</style>
    </motion.div>
  );
}
