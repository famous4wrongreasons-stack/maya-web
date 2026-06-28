"use client";

import { ScatterGallery } from "@/components/anim";
import { asset } from "@/lib/asset";

// Фото-работы кучкой в центре → расходятся по экрану (как «SIGNATURE»),
// на фоне — большая надпись «Мужская Эстетика». Тёмная тема наследуется.
// asset() обязателен — иначе на подпути /new сырые /media/... уходят в корень и 404.
const IMAGES = ["f1", "f5", "t3", "t5", "c8", "c10"].map((n) => asset(`/media/cuts/${n}.webp`));

export default function Ritual() {
  return (
    <ScatterGallery
      images={IMAGES}
      titleOver="Используем"
      titleStart="Дизайн"
      titleSpread="Создаём стиль"
      bgText="Мужская Эстетика"
      eyebrow="Результат"
      height={3600}
      className="relative z-[1] -mt-[8vh] w-full rounded-t-[2.5rem] bg-base shadow-[0_-40px_80px_-30px_rgba(0,0,0,0.9)]"
    />
  );
}
