"use client";

import {
  SmoothScrollProvider,
  AnimatedTextReveal,
  MediaReveal,
  SvgDrawLine,
  DividerReveal,
  ParallaxLayer,
  PinnedStorySection,
  ReviewCards,
  PriceCards,
  FlickTeamCarousel,
  LuxuryButton,
} from "@/components/anim";

// ОРИГИНАЛЬНЫЙ контент (вымышленный атeлье — не копия референса).
const img = (n) => `/media/cuts/c${n}.webp`;

const STORY = [
  { kicker: "01 — Consult", title: "We begin by listening.", body: "No two faces age alike. The first session is unhurried conversation and a long, honest look in good light — never a sales pitch.", image: img(1) },
  { kicker: "02 — Map", title: "Proportion before product.", body: "We read the face as architecture: angles, light, the way a smile moves. The plan follows the structure, not a trend.", image: img(2) },
  { kicker: "03 — Refine", title: "Subtle, by design.", body: "Micro-doses, layered over time. The goal is the version of you that looks rested — not the one that looks done.", image: img(3) },
  { kicker: "04 — Sustain", title: "A ritual, not a procedure.", body: "Skin longevity is maintenance, not rescue. We build a calm cadence you can keep for years.", image: img(4) },
];

const REVIEWS = [
  { text: "I walked out looking like myself on my best-rested day. Nobody could tell what I'd had done — which is exactly the point.", name: "Eleanor V.", meta: "Client · 2y" },
  { text: "The consultation alone was worth it. For the first time someone explained restraint instead of selling me everything.", name: "Marcus R.", meta: "Client · 1y" },
  { text: "Quiet, precise, unhurried. It feels less like a clinic and more like a very good tailor for your face.", name: "Sofia L.", meta: "Client · 3y" },
];

const PLANS = [
  { tier: "Essential", price: "£120", unit: "/ session", features: ["Skin diagnostic", "Single-area refinement", "Aftercare protocol"], cta: "Book", featured: false },
  { tier: "Signature", price: "£280", unit: "/ session", features: ["Full-face mapping", "Layered micro-dosing", "Quarterly review", "Priority booking"], cta: "Book signature", featured: true },
  { tier: "Atelier", price: "£540", unit: "/ quarter", features: ["Bespoke longevity plan", "Unlimited touch-ups", "Direct line to your nurse", "Annual imaging"], cta: "Enquire", featured: false },
];

const TEAM = [
  { name: "Dr. Amara Vella", role: "Founder · Nurse-led", image: img(1) },
  { name: "Iris Halden", role: "Aesthetic Nurse", image: img(2) },
  { name: "Léon Marchetti", role: "Skin Therapist", image: img(3) },
  { name: "Noa Brandt", role: "Consultant", image: img(4) },
  { name: "Yuki Sato", role: "Aesthetic Nurse", image: img(5) },
  { name: "Priya Anand", role: "Skin Therapist", image: img(6) },
];

export default function ShowcasePage() {
  return (
    <SmoothScrollProvider>
      <main className="overflow-hidden">
        {/* ============ HERO ============ */}
        <header className="relative mx-auto max-w-6xl px-6 pb-24 pt-28 md:pt-36">
          <div className="grid items-end gap-12 md:grid-cols-[1.15fr_0.85fr]">
            <div>
              <MediaReveal y={0} scale={1} duration={0.9}>
                <span className="text-[11px] uppercase tracking-[0.32em]" style={{ color: "var(--teal)" }}>
                  Atelier Lumière · Aesthetic atelier
                </span>
              </MediaReveal>

              <AnimatedTextReveal
                as="h1"
                text="Considered beauty, quietly engineered."
                className="font-display mt-7 text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.98]"
                stagger={0.06}
                duration={1.15}
              />

              <MediaReveal y={24} scale={1} delay={0.2} start="top 95%">
                <p className="mt-8 max-w-md text-[16px] leading-relaxed" style={{ color: "var(--body)" }}>
                  A nurse-led atelier for skin longevity — minimal intervention,
                  maximal restraint, results that whisper rather than announce.
                </p>
              </MediaReveal>

              <MediaReveal y={20} scale={1} delay={0.32} start="top 96%">
                <div className="mt-10 flex flex-wrap items-center gap-5">
                  <LuxuryButton href="#prices">Book a consultation</LuxuryButton>
                  <LuxuryButton variant="link" href="#method">Explore the method</LuxuryButton>
                </div>
              </MediaReveal>
            </div>

            {/* hero media — arch mask + parallax */}
            <MediaReveal y={48} scale={0.96} duration={1.3}>
              <div className="relative">
                <div className="mask-arch" style={{ aspectRatio: "3 / 4", boxShadow: "0 50px 90px -50px rgba(20,18,12,0.45)" }}>
                  <ParallaxLayer speed={0.12} className="h-full w-full">
                    <img src={img(2)} alt="" className="h-full w-full object-cover" style={{ filter: "grayscale(0.3) contrast(1.04) sepia(0.07)", transform: "scale(1.12)" }} />
                  </ParallaxLayer>
                </div>
                <SvgDrawLine
                  d="M4 60 C 60 4, 140 4, 196 60"
                  viewBox="0 0 200 64"
                  className="absolute -bottom-7 left-1/2 h-10 w-40 -translate-x-1/2"
                  stroke="var(--teal)"
                  strokeWidth={2}
                  duration={1.8}
                  delay={0.5}
                />
              </div>
            </MediaReveal>
          </div>

          <DividerReveal className="mt-24" color="var(--line)" thickness={1} />
        </header>

        {/* ============ PHILOSOPHY ============ */}
        <section id="method" className="mx-auto max-w-6xl px-6 py-24 md:py-36">
          <AnimatedTextReveal
            as="h2"
            text="We treat the face as architecture — proportion before product."
            className="font-display mx-auto max-w-4xl text-center text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.08]"
            stagger={0.05}
          />
          <div className="mt-20 grid items-center gap-14 md:grid-cols-2">
            <ParallaxLayer speed={0.18}>
              <div className="mask-blob" style={{ aspectRatio: "1 / 1" }}>
                <img src={img(5)} alt="" className="h-full w-full object-cover" style={{ filter: "grayscale(0.35) contrast(1.05) sepia(0.06)", transform: "scale(1.15)" }} />
              </div>
            </ParallaxLayer>
            <div>
              <MediaReveal y={28} scale={1}>
                <p className="text-[17px] leading-relaxed" style={{ color: "var(--ink)" }}>
                  Restraint is the hardest aesthetic discipline. Anyone can add — we
                  spend most of our craft deciding what to leave untouched.
                </p>
              </MediaReveal>
              <DividerReveal className="my-9" thickness={2} />
              <MediaReveal y={24} scale={1} delay={0.1}>
                <p className="text-[15px] leading-relaxed" style={{ color: "var(--body)" }}>
                  Every plan is built around how light moves across your face and how
                  it will move a decade from now. We measure twice, treat once, and
                  review often — so the result ages with you, not against you.
                </p>
              </MediaReveal>
            </div>
          </div>
        </section>

        {/* ============ PINNED STORY ============ */}
        <PinnedStorySection scenes={STORY} height={4200} eyebrow="The Method" className="my-10" />

        {/* ============ REVIEWS ============ */}
        <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="mb-14 flex items-end justify-between gap-8">
            <AnimatedTextReveal as="h2" text="In their words." className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-none" />
            <span className="hidden text-[12px] uppercase tracking-[0.28em] md:block" style={{ color: "var(--teal)" }}>
              Selected notes
            </span>
          </div>
          <ReviewCards reviews={REVIEWS} />
        </section>

        {/* ============ PRICES ============ */}
        <section id="prices" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="mb-14 max-w-xl">
            <AnimatedTextReveal as="h2" text="Memberships, not menus." className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-none" />
            <MediaReveal y={20} scale={1} delay={0.1}>
              <p className="mt-6 text-[15px] leading-relaxed" style={{ color: "var(--body)" }}>
                Longevity is a practice. Choose a cadence and we hold the long view with you.
              </p>
            </MediaReveal>
          </div>
          <PriceCards plans={PLANS} />
        </section>

        {/* ============ TEAM ============ */}
        <section className="py-24 md:py-32">
          <div className="mx-auto mb-14 max-w-6xl px-6">
            <AnimatedTextReveal as="h2" text="The hands behind the work." className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-none" />
            <MediaReveal y={18} scale={1} delay={0.1}>
              <p className="mt-5 text-[13px] uppercase tracking-[0.2em]" style={{ color: "var(--body)" }}>
                Drag to explore — or use the arrows
              </p>
            </MediaReveal>
          </div>
          <div className="mx-auto max-w-6xl px-6">
            <FlickTeamCarousel members={TEAM} />
          </div>
        </section>

        {/* ============ FOOTER CTA ============ */}
        <footer className="mx-auto max-w-6xl px-6 pb-28 pt-10 text-center">
          <DividerReveal className="mb-20" color="var(--line)" thickness={1} />
          <AnimatedTextReveal
            as="h2"
            text="Begin your consultation."
            className="font-display text-[clamp(2.4rem,7vw,5rem)] leading-none"
            stagger={0.07}
          />
          <MediaReveal y={20} scale={1} delay={0.25} start="top 96%">
            <div className="mt-12 flex justify-center">
              <LuxuryButton href="#prices">Book now</LuxuryButton>
            </div>
          </MediaReveal>
          <p className="mt-16 text-[11px] uppercase tracking-[0.28em]" style={{ color: "var(--body)" }}>
            Atelier Lumière — motion system demo · GSAP · ScrollTrigger · Lenis
          </p>
        </footer>
      </main>
    </SmoothScrollProvider>
  );
}
