"use client";

import { useEffect } from "react";

// Safari (особенно при «Никогда не воспроизводить» / Low Power) блокирует play() до первого
// жеста пользователя → фоновое HLS-видео висит с кнопкой Play, а scrub-видео не могут
// «прогреться» (play→pause для декодирования кадра) и остаются чёрными при перемотке.
// По ПЕРВОМУ жесту (клик/тап/клавиша) прогреваем все <video> разом:
//   • loop (фоновое зацикленное) — оставляем играть;
//   • остальные (scrub) — play→pause, чтобы Safari декодировал кадр и seek начал рисовать.
export default function VideoWarmup() {
  useEffect(() => {
    let done = false;
    const warm = () => {
      if (done) return;
      done = true;
      document.querySelectorAll("video").forEach((v) => {
        try {
          v.muted = true;
          const p = v.play();
          if (v.loop) return;
          if (p && p.then) p.then(() => { try { v.pause(); } catch (e) {} }).catch(() => {});
          else { try { v.pause(); } catch (e) {} }
        } catch (e) {}
      });
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", warm);
      window.removeEventListener("touchstart", warm);
      window.removeEventListener("keydown", warm);
    };
    window.addEventListener("pointerdown", warm, { passive: true });
    window.addEventListener("touchstart", warm, { passive: true });
    window.addEventListener("keydown", warm, { passive: true });
    return cleanup;
  }, []);
  return null;
}
