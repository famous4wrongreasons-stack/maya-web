"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES } from "@/data/services";
import { MASTERS } from "@/data/masters";
import ConsentCheckbox, { CONSENT_ERROR } from "@/components/ConsentCheckbox";

const ease = [0.16, 1, 0.3, 1];
const SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00", "20:30"];
const WD = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const STEPS = ["Услуга", "Мастер", "Время", "Контакты"];

export default function Booking() {
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState({ service: null, master: null, day: 0, time: null });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const days = useMemo(() => {
    const out = [];
    const base = new Date();
    for (let k = 0; k < 7; k++) {
      const d = new Date(base);
      d.setDate(base.getDate() + k);
      out.push({ k, wd: WD[d.getDay()], n: d.getDate() });
    }
    return out;
  }, []);

  const set = (patch) => setPick((p) => ({ ...p, ...patch }));
  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const submit = () => {
    if (!agree) {
      setError(CONSENT_ERROR);
      return;
    }
    if (!name.trim() || phone.trim().length < 6) return;
    setError(null);
    setDone(true);
  };

  return (
    <section id="booking" className="px-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-line bg-panel/40 p-7 md:p-12">
        <p className="mb-4 text-[11px] uppercase tracking-brand text-gold/80">Запись онлайн</p>
        <h2 className="text-balance text-3xl font-extralight leading-[1.12] tracking-tight md:text-[2.4rem]">
          Запишитесь, <span className="text-ink/40">не уходя с сайта</span>
        </h2>

        {/* Шаги */}
        <div className="mt-8 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span className={`text-[10px] uppercase tracking-wide2 transition-colors ${i <= step ? "text-ink" : "text-ink/30"}`}>{s}</span>
              <span className={`h-px flex-1 transition-colors ${i < step ? "bg-maya/60" : "bg-line"}`} />
            </div>
          ))}
        </div>

        <div className="mt-8 min-h-[230px]">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }} className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-maya/15 text-maya">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-11" /></svg>
                </div>
                <h3 className="mt-5 text-xl font-extralight">Заявка собрана</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm font-light leading-relaxed text-ink/60">
                  {pick.service} · {pick.master} · {days[pick.day].wd} {days[pick.day].n}, {pick.time}. Подключим YClients — и запись создастся в расписании автоматически.
                </p>
                <button onClick={() => { setDone(false); setStep(0); setPick({ service: null, master: null, day: 0, time: null }); setName(""); setPhone(""); setAgree(false); setError(null); }} className="mt-6 rounded-full border border-line px-6 py-2.5 text-[11px] uppercase tracking-wide2 text-ink/80 transition hover:text-ink">Записать ещё</button>
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease }}>
                {step === 0 && (
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {SERVICES.map((s) => (
                      <button key={s.name} onClick={() => { set({ service: s.name }); next(); }} className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors ${pick.service === s.name ? "border-maya/60 bg-gold/5" : "border-line hover:border-ink/30"}`}>
                        <span className="text-sm font-light">{s.name}</span>
                        <span className="text-[12px] text-ink/45">{s.price}</span>
                      </button>
                    ))}
                  </div>
                )}
                {step === 1 && (
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {MASTERS.map((m) => (
                      <button key={m.name} onClick={() => { set({ master: m.name }); next(); }} className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors ${pick.master === m.name ? "border-maya/60 bg-gold/5" : "border-line hover:border-ink/30"}`}>
                        <span className="text-sm font-light">{m.name}</span>
                        <span className="text-[10px] uppercase tracking-wide2 text-ink/40">{m.role}</span>
                      </button>
                    ))}
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {days.map((d) => (
                        <button key={d.k} onClick={() => set({ day: d.k, time: null })} className={`flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl border transition-colors ${pick.day === d.k ? "border-maya/60 bg-gold/5 text-ink" : "border-line text-ink/60 hover:text-ink"}`}>
                          <span className="text-[10px] uppercase">{d.wd}</span>
                          <span className="text-lg font-light">{d.n}</span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {SLOTS.map((t, i) => {
                        const taken = (pick.day + i) % 4 === 0; // mock занятость
                        return (
                          <button key={t} disabled={taken} onClick={() => { set({ time: t }); next(); }} className={`rounded-lg border py-2.5 text-sm transition-colors ${taken ? "border-line/50 text-ink/20 line-through" : pick.time === t ? "border-maya/60 bg-gold/5 text-ink" : "border-line text-ink/75 hover:border-ink/30"}`}>
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-line bg-base/30 p-4 text-sm font-light text-ink/70">
                      {pick.service} · {pick.master}<br />
                      <span className="text-ink/45">{days[pick.day].wd} {days[pick.day].n}, {pick.time || "—"}</span>
                    </div>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" className="w-full rounded-xl border border-line bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink/40 focus:outline-none" />
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" inputMode="tel" className="w-full rounded-xl border border-line bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-ink/40 focus:outline-none" />
                    <ConsentCheckbox
                      id="section-booking-personal-data-consent"
                      checked={agree}
                      onChange={(next) => {
                        setAgree(next);
                        if (next) setError(null);
                      }}
                      error={error}
                    />
                    <button onClick={submit} disabled={!name.trim() || phone.trim().length < 6} className={`w-full rounded-full py-3.5 text-[11px] uppercase tracking-wide2 transition ${name.trim() && phone.trim().length >= 6 ? "bg-gold text-base hover:opacity-90" : "cursor-not-allowed border border-line text-ink/30"}`}>Подтвердить запись</button>
                    <p className="text-center text-[10px] uppercase tracking-wide2 text-ink/35">Демо · подключается к YClients</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!done && step > 0 && (
          <button onClick={back} className="mt-6 text-[11px] uppercase tracking-wide2 text-ink/45 transition hover:text-ink">← Назад</button>
        )}
      </div>
    </section>
  );
}
