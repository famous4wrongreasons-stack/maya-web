import "./globals.css";
import localFont from "next/font/local";
import SmoothScroll from "@/components/SmoothScroll";
import VideoWarmup from "@/components/VideoWarmup";
import MayaChat from "@/features/maya-chat/MayaChat";
import PromoBanner from "@/features/promo/PromoBanner";
import ExitIntentBanner from "@/features/promo/ExitIntentBanner";
import { AuthProvider } from "@/features/auth/auth";

const montserrat = localFont({
  src: [
    { path: "../fonts/Montserrat-Thin.otf", weight: "100", style: "normal" },
    { path: "../fonts/Montserrat-ExtraLight.otf", weight: "200", style: "normal" },
    { path: "../fonts/Montserrat-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/Montserrat-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/Montserrat-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/Montserrat-SemiBold.otf", weight: "600", style: "normal" },
  ],
  variable: "--font-mont",
  display: "swap",
});

// Manrope — шрифт «Maya», как в приложении
const manrope = localFont({
  src: "../fonts/manrope-400-latin.woff2",
  variable: "--font-maya",
  display: "swap",
});

// мужскаяэстетика.рф в punycode
const SITE_URL = "https://xn--80aaocmjdk0cclbf8l3a.xn--p1ai";
const TITLE = "Мужская Эстетика — Парикмахерская · Ставрополь";
const DESCRIPTION =
  "Премиальная мужская парикмахерская в Ставрополе. Стрижка, борода и уход. Цифровой администратор Maya подберёт стрижку, мастера и время.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Мужская Эстетика",
  keywords: [
    "барбершоп Ставрополь",
    "мужская парикмахерская",
    "стрижка Ставрополь",
    "оформление бороды",
    "Мужская Эстетика",
    "Malesthetic",
    "запись онлайн",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Мужская Эстетика",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport = {
  themeColor: "#07070A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${montserrat.variable} ${manrope.variable}`}>
      <body>
        <AuthProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <VideoWarmup />
          <MayaChat />
          <PromoBanner />
          <ExitIntentBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
