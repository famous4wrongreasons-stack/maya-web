import Link from "next/link";
import Hero from "@/sections/Hero";
import ConciergeTeaser from "@/sections/ConciergeTeaser";
import Services from "@/sections/Services";
import Ritual from "@/sections/Ritual";
import Masters from "@/sections/Masters";
import Catalogue from "@/sections/Catalogue";
import ScrubScene from "@/components/ScrubScene";
import AppBlock from "@/sections/AppBlock";
import Faq from "@/sections/Faq";
import Contacts from "@/sections/Contacts";
import Nav from "@/components/Nav";
import Logo from "@/components/Logo";
import { SmoothScrollProvider } from "@/components/anim";
import { BRAND } from "@/data/brand";

export default function Home() {
  return (
    <SmoothScrollProvider>
    <main className="lux-dark relative">
      <Nav />
      <Hero />
      <Ritual />
      <Services />
      <ConciergeTeaser />
      <Masters />
      <ScrubScene src="/media/clipper-scrub.mp4" fit="object-contain scale-[1.65] md:scale-100 md:object-cover" />
      <Catalogue />
      <AppBlock />
      <Faq />
      <Contacts />

      <footer className="border-t border-line px-6 py-16 text-center md:py-20">
        <Logo className="mx-auto h-8 w-8 text-ink/85" />
        <div className="mt-7 flex items-center justify-center gap-3">
          <a href={BRAND.telegram} target="_blank" rel="noreferrer" aria-label="Telegram" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink/70 transition-colors hover:border-maya/60 hover:text-ink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 15.6 9.6 19c.36 0 .52-.16.71-.35l1.7-1.64 3.53 2.59c.65.36 1.11.17 1.28-.6l2.32-10.9c.21-.97-.35-1.35-.98-1.12L3.6 10.55c-.95.37-.93.9-.16 1.14l4.17 1.3L17.3 6.9c.45-.3.86-.13.52.17z" /></svg>
          </a>
          <a href={BRAND.vk} target="_blank" rel="noreferrer" aria-label="ВКонтакте" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink/70 transition-colors hover:border-maya/60 hover:text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.16 17.2c-5.06 0-7.95-3.47-8.07-9.24h2.54c.08 4.24 1.95 6.03 3.43 6.4V7.96h2.39v3.66c1.46-.16 3-1.82 3.51-3.66h2.39c-.4 1.91-1.83 3.57-3.04 4.25 1.21.55 2.83 2 3.45 4.99h-2.63c-.48-1.49-1.7-2.64-3.18-2.83v2.83h-.29z" /></svg>
          </a>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center text-[10px] uppercase tracking-wide2 text-ink/35">
          <Link href="/privacy" className="transition-colors hover:text-ink/70">Политика конфиденциальности</Link>
          <span>© 2026 {BRAND.name}</span>
          <span className="text-ink/25">Designed by <span className="text-ink/50">MOCINE</span></span>
        </div>
      </footer>
    </main>
    </SmoothScrollProvider>
  );
}
