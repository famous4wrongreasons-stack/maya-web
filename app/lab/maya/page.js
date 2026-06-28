"use client";

import { useEffect } from "react";

// Изолированное превью чата Maya — открывается автоматически
export default function LabMaya() {
  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new CustomEvent("maya:open")), 350);
    return () => clearTimeout(t);
  }, []);
  return (
    <main className="flex h-[100svh] items-center justify-center bg-base">
      <p className="text-[11px] uppercase tracking-brand text-ink/35">Превью · Maya</p>
    </main>
  );
}
