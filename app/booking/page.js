"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import { MASTERS } from "@/data/masters";
import { useAuth } from "@/features/auth/auth";
import { ycServices, ycDates, ycTimes, ycBook, bookingPrefill } from "@/lib/api/proxy";
import { asset } from "@/lib/asset";

const ease = [0.16, 1, 0.3, 1];
const WD = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const STEPS = ["Мастер", "Услуга", "Время", "Подтверждение"];

const price = (s) =>
  s.price_min === s.price_max
    ? `${s.price_min.toLocaleString("ru")} ₽`
    : `${s.price_min.toLocaleString("ru")}–${s.price_max.toLocaleString("ru")} ₽`;

const fmtDay = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return { wd: WD[d.getDay()], n: d.getDate() };
};

const authName = (user) =>
  [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();

const authPhone = (user) =>
  user?.phone || user?.phone_number || user?.phoneRaw || user?.contact_phone || "";

export default function BookingPage() {
  const { user, ready } = useAuth();
  const [step, setStep] = useState(0);
  const [master, setMaster] = useState(null);
  const [service, setService] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const [services, setServices] = useState([]);
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookError, setBookError] = useState(null);
  const [done, setDone] = useState(false);
  const [prefillState, setPrefillState] = useState("idle");
  const autofilledName = useRef("");
  const autofilledPhone = useRef("");

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const applyName = (nextName) => {
    const clean = String(nextName || "").trim();
    if (!clean) return;
    setName((current) => {
      if (current.trim() && current !== autofilledName.current) return current;
      autofilledName.current = clean;
      return clean;
    });
  };

  const applyPhone = (nextPhone) => {
    const clean = String(nextPhone || "").trim();
    if (!clean) return;
    setPhone((current) => {
      if (current.trim() && current !== autofilledPhone.current) return current;
      autofilledPhone.current = clean;
      return clean;
    });
  };

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const fallbackName = authName(user);
    const fallbackPhone = authPhone(user);
    applyName(fallbackName);
    applyPhone(fallbackPhone);

    setPrefillState("loading");
    bookingPrefill(user)
      .then((profile) => {
        if (cancelled) return;
        if (profile?.success && profile.known) {
          applyName(profile.name || profile.full_name || fallbackName);
          applyPhone(profile.phone || fallbackPhone);
          if (profile.phone || fallbackPhone) setPrefillState("filled");
          else if (profile.needs_consent) setPrefillState("needs_consent");
          else setPrefillState("phone_missing");
        } else if (fallbackName || fallbackPhone) {
          setPrefillState(fallbackPhone ? "filled" : "name_only");
        } else {
          setPrefillState("idle");
        }
      })
      .catch(() => {
        if (!cancelled) setPrefillState(fallbackName || fallbackPhone ? (fallbackPhone ? "filled" : "name_only") : "idle");
      });

    return () => { cancelled = true; };
  }, [ready, user]);

  const pickMaster = async (m) => {
    setMaster(m);
    setService(null); setDate(null); setTime(null); setServices([]); setDates([]); setTimes([]);
    setStep(1);
    setLoading(true);
    const list = await ycServices(m.staffId).catch(() => []);
    setServices(list);
    setLoading(false);
  };

  const pickService = async (s) => {
    setService(s);
    setDate(null); setTime(null); setDates([]); setTimes([]);
    setStep(2);
    setLoading(true);
    const list = await ycDates(master.staffId, s.id).catch(() => []);
    setDates(list);
    setLoading(false);
  };

  const pickDate = async (iso) => {
    setDate(iso); setTime(null); setTimes([]);
    setLoading(true);
    const list = await ycTimes(master.staffId, service.id, iso).catch(() => []);
    setTimes(list);
    setLoading(false);
  };

  const pickTime = (t) => { setTime(t); setStep(3); };

  const submit = async () => {
    if (!agree || submitting) return;
    setSubmitting(true);
    setBookError(null);
    try {
      const d = await ycBook({ staffId: master.staffId, serviceId: service.id, date, time, name, phone });
      if (d?.success) setDone(true);
      else setBookError(d?.meta?.message || "Не удалось создать запись. Возможно, это время только что заняли — выберите другое.");
    } catch {
      setBookError("Нет связи с сервером записи. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  };

  const dd = date ? fmtDay(date) : null;

  return (
    <main className="min-h-[100svh] bg-base">
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="text-ink/90 transition hover:text-ink"><Logo className="h-6 w-6 md:h-7 md:w-7" /></Link>
        <Link href="/" className="text-[11px] uppercase tracking-wide2 text-ink/50 transition hover:text-ink">На главную ✕</Link>
      </header>

      <div className="mx-auto max-w-2xl px-6 pb-24 pt-6 md:pt-12">
        <p className="mb-4 text-[11px] uppercase tracking-brand text-gold/80">Онлайн-запись</p>
        <h1 className="text-balance text-3xl font-extralight leading-[1.12] tracking-tight md:text-5xl">
          {done ? "Готово" : "Запишитесь в пару шагов"}
        </h1>

        {!done && (
          <div className="mt-8 flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <span className={`whitespace-nowrap text-[10px] uppercase tracking-wide2 transition-colors ${i <= step ? "text-ink" : "text-ink/30"}`}>{s}</span>
                <span className={`h-px flex-1 transition-colors ${i < step ? "bg-gold/60" : "bg-line"}`} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 min-h-[280px]">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maya/15 text-maya">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-11" /></svg>
                </div>
                <p className="mx-auto mt-6 max-w-md text-lg font-extralight leading-relaxed text-ink/80">
                  {master?.name} · {service?.title}<br />{dd?.wd} {dd?.n}, {time}
                </p>
                <p className="mx-auto mt-3 max-w-sm text-sm font-light text-ink/50">Запись создана в YClients — мастер видит её в расписании. Ждём вас!</p>
                <Link href="/" className="mt-8 inline-block rounded-full btn-fill px-8 py-3.5 text-[11px] uppercase tracking-wide2 transition-opacity hover:opacity-85">На главную</Link>
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease }}>
                {/* Шаг 0 — мастер */}
                {step === 0 && (
                  <div className="flex flex-col gap-2.5">
                    {MASTERS.map((m) => (
                      <button key={m.name} onClick={() => pickMaster(m)} className={`group flex items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-colors ${master?.name === m.name ? "border-gold/60 bg-gold/5" : "border-line hover:border-ink/30"}`}>
                        <span className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 transition-colors ${master?.name === m.name ? "ring-gold/60" : "ring-line group-hover:ring-ink/30"}`}>
                          <img src={asset(m.photo)} alt={m.name} loading="lazy" className="h-full w-full object-cover object-top" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-light text-ink">{m.name}</span>
                          <span className="mt-0.5 block text-[10px] uppercase tracking-wide2 text-gold/70">{m.role}</span>
                        </span>
                        <span className={`text-base transition-colors ${master?.name === m.name ? "text-gold/80" : "text-ink/25 group-hover:text-ink/60"}`}>→</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Шаг 1 — услуга (живой YClients) */}
                {step === 1 && (
                  loading ? <Skeleton rows={5} /> : services.length === 0 ? (
                    <Empty text="У мастера нет услуг для онлайн-записи." />
                  ) : (
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {services.map((s) => (
                        <button key={s.id} onClick={() => pickService(s)} className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-4 text-left transition-colors ${service?.id === s.id ? "border-gold/60 bg-gold/5" : "border-line hover:border-ink/30"}`}>
                          <span className="text-sm font-light">{s.title}</span>
                          <span className="shrink-0 text-[12px] text-ink/45">{price(s)}</span>
                        </button>
                      ))}
                    </div>
                  )
                )}

                {/* Шаг 2 — дата + время (живой YClients) */}
                {step === 2 && (
                  <div>
                    {loading && dates.length === 0 ? <Skeleton rows={2} /> : dates.length === 0 ? (
                      <Empty text="Нет свободных дат у этого мастера на ближайшее время." />
                    ) : (
                      <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {dates.map((iso) => {
                          const f = fmtDay(iso);
                          return (
                            <button key={iso} onClick={() => pickDate(iso)} className={`flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl border transition-colors ${date === iso ? "border-gold/60 bg-gold/5 text-ink" : "border-line text-ink/60 hover:text-ink"}`}>
                              <span className="text-[10px] uppercase">{f.wd}</span>
                              <span className="text-lg font-light">{f.n}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {date && (
                      <div className="mt-4">
                        {loading ? <Skeleton rows={2} /> : times.length === 0 ? (
                          <Empty text="На этот день всё занято — выберите другую дату." />
                        ) : (
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {times.map((t) => (
                              <button key={t} onClick={() => pickTime(t)} className={`rounded-lg border py-3 text-sm transition-colors ${time === t ? "border-gold/60 bg-gold/5 text-ink" : "border-line text-ink/75 hover:border-ink/30"}`}>
                                {t}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Шаг 3 — подтверждение */}
                {step === 3 && (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-line bg-panel/40 p-5 text-sm font-light text-ink/75">
                      {master?.name} · {service?.title}<br />
                      <span className="text-ink/45">{dd?.wd} {dd?.n}, {time} · {service ? price(service) : ""}</span>
                    </div>
                    {prefillState === "filled" && (
                      <p className="rounded-xl border border-maya/20 bg-maya/10 px-4 py-3 text-[12px] font-light leading-relaxed text-ink/65">
                        Данные подтянули из кабинета — проверьте и подтвердите запись.
                      </p>
                    )}
                    {(prefillState === "name_only" || prefillState === "phone_missing" || prefillState === "needs_consent") && (
                      <p className="rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-[12px] font-light leading-relaxed text-ink/60">
                        Телефон не привязан к кабинету — укажите номер для этой записи. Имя можно поправить, если нужно.
                      </p>
                    )}
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" className="w-full rounded-xl border border-line bg-transparent px-4 py-3.5 text-sm text-ink placeholder:text-ink/35 focus:border-ink/40 focus:outline-none" />
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" inputMode="tel" className="w-full rounded-xl border border-line bg-transparent px-4 py-3.5 text-sm text-ink placeholder:text-ink/35 focus:border-ink/40 focus:outline-none" />
                    <label className="flex cursor-pointer items-start gap-3 pt-1 text-[12px] font-light leading-relaxed text-ink/55">
                      <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-gold" />
                      <span>
                        Соглашаюсь на обработку персональных данных согласно{" "}
                        <Link href="/privacy" target="_blank" className="text-ink/80 underline underline-offset-2 transition hover:text-ink">политике конфиденциальности</Link>.
                      </span>
                    </label>
                    {bookError && <p className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-[13px] font-light text-red-300/90">{bookError}</p>}
                    <button onClick={submit} disabled={!agree || !name.trim() || phone.trim().length < 6 || submitting} className={`w-full rounded-full py-4 text-[11px] uppercase tracking-wide2 transition ${agree && name.trim() && phone.trim().length >= 6 && !submitting ? "btn-fill" : "cursor-not-allowed border border-line text-ink/30"}`}>
                      {submitting ? "Записываем…" : "Записаться"}
                    </button>
                    <p className="text-center text-[10px] uppercase tracking-wide2 text-ink/35">Запись создаётся в YClients салона</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!done && step > 0 && (
          <button onClick={back} className="mt-4 text-[11px] uppercase tracking-wide2 text-ink/45 transition hover:text-ink">← Назад</button>
        )}
      </div>
    </main>
  );
}

function Skeleton({ rows = 3 }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {Array.from({ length: rows * 2 }).map((_, i) => (
        <div key={i} className="h-[58px] animate-pulse rounded-xl border border-line bg-panel/30" />
      ))}
    </div>
  );
}

function Empty({ text }) {
  return <p className="py-10 text-center text-sm font-light text-ink/45">{text}</p>;
}
