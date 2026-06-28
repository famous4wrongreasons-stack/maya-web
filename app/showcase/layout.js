import { Playfair_Display } from "next/font/google";

// Editorial serif для дисплейных заголовков (только на /showcase).
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: "Motion System — Showcase",
  description: "GSAP + ScrollTrigger + Lenis: переиспользуемые компоненты анимаций.",
};

export default function ShowcaseLayout({ children }) {
  return <div className={`${playfair.variable} showcase min-h-screen`}>{children}</div>;
}
