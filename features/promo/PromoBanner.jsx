"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import GiftCard from "./GiftCard";

// Стартовый баннер «Подарок» (мобила + десктоп), один раз на устройство.
// ?promo=1 форс, ?promo=reset сброс. Вид — общий GiftCard.
const KEY = "maya_promo_seen";

export default function PromoBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    if (qs.get("promo") === "reset") { try { localStorage.removeItem(KEY); } catch (e) {} }
    const force = qs.get("promo") === "1";
    if (!force) {
      try { if (localStorage.getItem(KEY)) return; } catch (e) {}
    }
    const t = setTimeout(() => setShow(true), 900);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => { try { localStorage.setItem(KEY, "1"); } catch (e) {} setShow(false); };

  return (
    <AnimatePresence>
      {show && (
        <GiftCard
          photo="/media/promo.jpg"
          title="Подарок"
          subtitle="Если решил зайти к нам впервые — у нас для тебя подарок."
          code="MAYA20"
          onClose={dismiss}
        />
      )}
    </AnimatePresence>
  );
}
