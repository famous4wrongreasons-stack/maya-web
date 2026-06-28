"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/features/cart/cart";
import { useAuth, TelegramLogin } from "@/features/auth/auth";
import { shopCreate } from "@/lib/api/proxy";

const ease = [0.16, 1, 0.3, 1];
const rub = (n) => n.toLocaleString("ru") + " ₽";

export default function CheckoutPage() {
  const { items, remove, setQty, total, count, ready } = useCart();
  const { user, ready: authReady, logout } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [payingId, setPayingId] = useState(null);
  const [error, setError] = useState(null);

  const baseOk = name.trim().length > 1 && phone.trim().length > 5 && agree && !!user;

  const pay = async (it) => {
    if (!baseOk || payingId) return;
    setError(null);
    setPayingId(it.id);
    try {
      const d = await shopCreate(
        it.kind === "sub"
          ? { kind: "sub", plan: it.plan, tier: it.tier, recipient_name: name, recipient_phone: phone, auth_data: user }
          : { kind: "cert", amount: it.amount, recipient_name: name, recipient_phone: phone, auth_data: user }
      );
      if (d?.confirmation_url) {
        window.location.href = d.confirmation_url;
        return;
      }
      setError(d?.message || "Не удалось создать оплату. Позвоните +7 962 447-67-47.");
    } catch {
      setError("Нет связи с сервером оплаты. Попробуйте ещё раз.");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-6 md:pt-12">
      <p className="mb-4 text-[11px] uppercase tracking-brand text-gold/80">Оформление заказа</p>
      <h1 className="text-balance text-3xl font-extralight leading-[1.12] tracking-tight md:text-5xl">Корзина</h1>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          {!ready ? (
            <motion.div key="loading" className="py-12 text-center text-sm text-ink/40">Загрузка…</motion.div>
          ) : count === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="py-12 text-center">
              <p className="text-lg font-extralight text-ink/70">Корзина пуста</p>
              <p className="mx-auto mt-3 max-w-sm text-sm font-light text-ink/45">Загляните в магазин — там сертификаты и абонементы.</p>
              <Link href="/shop" className="mt-7 inline-block rounded-full btn-fill px-8 py-3.5 text-[11px] uppercase tracking-wide2 transition-opacity hover:opacity-85">В магазин</Link>
            </motion.div>
          ) : (
            <motion.div key="cart" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
              {/* Позиции */}
              <div className="space-y-3">
                {items.map((it) => (
                  <div key={it.id} className="rounded-2xl border border-line bg-panel/40 p-4">
                    <div className="flex items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-light text-ink">{it.label}</p>
                        <p className="mt-0.5 text-[12px] text-ink/45">{rub(it.amount)}{it.kind === "sub" ? " /мес" : ""}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full border border-line px-1">
                        <button onClick={() => setQty(it.id, it.qty - 1)} aria-label="Меньше" className="flex h-7 w-7 items-center justify-center rounded-full text-ink/60 transition hover:text-ink">−</button>
                        <span className="w-5 text-center text-sm">{it.qty}</span>
                        <button onClick={() => setQty(it.id, it.qty + 1)} aria-label="Больше" className="flex h-7 w-7 items-center justify-center rounded-full text-ink/60 transition hover:text-ink">+</button>
                      </div>
                      <button onClick={() => remove(it.id)} aria-label="Удалить" className="rounded-full p-2.5 text-ink/35 transition hover:text-ink">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                      </button>
                    </div>
                    <button onClick={() => pay(it)} disabled={!baseOk || !!payingId} className={`mt-3 w-full rounded-full py-2.5 text-[11px] uppercase tracking-wide2 transition ${baseOk && !payingId ? "btn-fill" : "cursor-not-allowed border border-line text-ink/30"}`}>
                      {payingId === it.id ? "Создаём оплату…" : `Оплатить ${rub(it.amount)}`}
                    </button>
                  </div>
                ))}
              </div>

              {/* Итог */}
              <div className="mt-4 flex items-center justify-between border-t border-line pt-5">
                <span className="text-[11px] uppercase tracking-wide2 text-ink/45">Всего в корзине</span>
                <span className="text-2xl font-extralight">{rub(total)}</span>
              </div>

              {/* Получатель + согласие */}
              <div className="mt-8 space-y-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя получателя" className="w-full rounded-xl border border-line bg-transparent px-4 py-3.5 text-sm text-ink placeholder:text-ink/35 focus:border-ink/40 focus:outline-none" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон получателя" inputMode="tel" className="w-full rounded-xl border border-line bg-transparent px-4 py-3.5 text-sm text-ink placeholder:text-ink/35 focus:border-ink/40 focus:outline-none" />
                <label className="flex cursor-pointer items-start gap-3 pt-1 text-[12px] font-light leading-relaxed text-ink/55">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-gold" />
                  <span>
                    Соглашаюсь на обработку персональных данных согласно{" "}
                    <Link href="/privacy" target="_blank" className="text-ink/80 underline underline-offset-2 transition hover:text-ink">политике конфиденциальности</Link>.
                  </span>
                </label>
              </div>

              {/* Вход (обязателен для оплаты) */}
              {authReady && (
                <div className="mt-6 rounded-2xl border border-line bg-panel/30 p-5">
                  {user ? (
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-light text-ink/75">
                        Вы вошли: <span className="text-ink">{user.first_name || "Telegram"}</span>
                      </p>
                      <button onClick={logout} className="text-[11px] uppercase tracking-wide2 text-ink/45 transition hover:text-ink">Выйти</button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-light text-ink/70">Войдите через Telegram, чтобы оплатить — покупка придёт в ваш аккаунт <span className="font-maya text-maya">Maya</span>.</p>
                      <div className="mt-3"><TelegramLogin /></div>
                      <p className="mt-2 text-[10px] uppercase tracking-wide2 text-ink/30">Вход работает на боевом домене сайта</p>
                    </div>
                  )}
                </div>
              )}

              {error && <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-[13px] font-light text-red-300/90">{error}</p>}
              <p className="mt-4 text-center text-[10px] uppercase tracking-wide2 text-ink/35">Оплата картой через ЮKassa · сертификат и абонемент — каждый отдельной оплатой</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
