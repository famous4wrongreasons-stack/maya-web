"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import GiftCard from "./GiftCard";

// Exit-баннер (десктоп): курсор уходит к краю окна → тот же «Подарок», что на входе,
// но с другим фото. Один раз на устройство. ?exit=1 форс, ?exit=reset сброс.
const KEY = "maya_exit_seen";

export default function ExitIntentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    if (qs.get("exit") === "reset") { try { localStorage.removeItem(KEY); } catch (e) {} }
    if (qs.get("exit") === "1") { setShow(true); return; }

    if (!window.matchMedia("(pointer: fine)").matches) return; // только десктоп (есть курсор)
    try { if (localStorage.getItem(KEY)) return; } catch (e) {}

    let armed = false;
    const arm = setTimeout(() => { armed = true; }, 2500); // не раньше 2.5с
    const onOut = (e) => {
      if (!armed) return;
      if (e.clientY <= 0 && !e.relatedTarget) {
        setShow(true);
        try { localStorage.setItem(KEY, "1"); } catch (er) {}
        document.removeEventListener("mouseout", onOut);
      }
    };
    document.addEventListener("mouseout", onOut);
    return () => { clearTimeout(arm); document.removeEventListener("mouseout", onOut); };
  }, []);

  const dismiss = () => setShow(false);

  return (
    <AnimatePresence>
      {show && (
        <GiftCard
          photo="/media/promo2.jpg"
          title="Подарок"
          subtitle="Не уходите без подарка — новым гостям −20% на первое посещение."
          code="MAYA20"
          onClose={dismiss}
        />
      )}
    </AnimatePresence>
  );
}
