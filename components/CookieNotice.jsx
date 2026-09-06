"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PERSONAL_DATA_POLICY_PATH } from "@/components/ConsentCheckbox";

const KEY = "maya_cookie_notice_accepted_v1";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] px-4 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-line bg-base/95 p-4 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-5">
        <p className="text-[12px] font-light leading-relaxed text-ink/65">
          Мы используем cookies и аналитические сервисы, включая Яндекс.Метрику, чтобы сайт работал корректно
          и мы понимали, какие разделы полезны посетителям. Продолжая пользоваться сайтом, вы соглашаетесь
          с использованием cookies и обработкой технических данных согласно{" "}
          <Link href={PERSONAL_DATA_POLICY_PATH} className="text-ink/85 underline underline-offset-2 transition hover:text-ink">
            Политике обработки персональных данных
          </Link>.
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-full border border-line px-6 py-2.5 text-[11px] uppercase tracking-wide2 text-ink/80 transition hover:border-ink/40 hover:text-ink"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
