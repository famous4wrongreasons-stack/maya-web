"use client";

import { useEffect, useRef } from "react";

// Фоновый плеер HLS-потока (.m3u8): нативно в Safari, через hls.js в остальных браузерах.
// Без контролов — autoplay/loop/muted/playsInline, как фоновый визуал.
export default function HlsVideo({ src, className = "", style, poster }) {
  const ref = useRef(null);
  // Ставим muted СРАЗУ при создании элемента (до попытки автозапуска). React сам ставит только
  // свойство muted, но не атрибут, а Safari проверяет именно АТРИБУТ → иначе блокирует автозапуск.
  const setRef = (el) => { ref.current = el; if (el) { el.muted = true; el.defaultMuted = true; } };

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", ""); // явный атрибут для Safari
    let hls, cancelled = false;
    const playSafe = () => { try { v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {} };

    const isHls = /\.m3u8($|\?)/.test(src);
    if (!isHls) {
      // Локальный mp4/webm — напрямую (надёжнее HLS, особенно в Safari)
      v.src = src;
      v.addEventListener("loadedmetadata", playSafe);
    } else if (v.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari / iOS — нативный HLS
      v.src = src;
      v.addEventListener("loadedmetadata", playSafe);
    } else {
      // Chrome / Firefox / Edge — через hls.js (динамический импорт → отдельный чанк)
      import("hls.js")
        .then(({ default: Hls }) => {
          if (cancelled || !ref.current) return;
          if (Hls.isSupported()) {
            hls = new Hls({ enableWorker: true, capLevelToPlayerSize: true });
            hls.loadSource(src);
            hls.attachMedia(v);
            hls.on(Hls.Events.MANIFEST_PARSED, playSafe);
          } else {
            v.src = src;
            v.addEventListener("loadedmetadata", playSafe);
          }
        })
        .catch(() => {});
    }

    // Прячем Play-кнопку: пока видео не заиграло, держим его прозрачным (вместе с ним невидима
    // и Safari-кнопка Play), а как реально пошло воспроизведение — плавно проявляем.
    const onPlaying = () => { try { v.style.opacity = "1"; } catch (e) {} };
    // Если Safari ставит на паузу — прячем (Play-кнопка невидима) и сразу возобновляем.
    const onPause = () => { try { v.style.opacity = "0"; } catch (e) {} playSafe(); };
    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);

    // Запуск при появлении блока в кадре (глобальный прогрев по жесту — в VideoWarmup).
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) playSafe(); }, { threshold: 0.1 });
    io.observe(v);

    return () => {
      cancelled = true;
      v.removeEventListener("loadedmetadata", playSafe);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
      io.disconnect();
      if (hls) hls.destroy();
    };
  }, [src]);

  return <video ref={setRef} className={className} style={{ opacity: 0, transition: "opacity 0.7s ease", ...style }} poster={poster} muted loop playsInline autoPlay preload="auto" />;
}
