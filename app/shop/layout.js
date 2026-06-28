import Link from "next/link";
import Logo from "@/components/Logo";
import { CartProvider, CartButton } from "@/features/cart/cart";
import { AccountControl } from "@/features/auth/auth";

export const metadata = { title: "Магазин — Мужская Эстетика" };

export default function ShopLayout({ children }) {
  return (
    <CartProvider>
      <main className="min-h-[100svh] bg-base">
        <header className="flex items-center justify-between px-6 pb-10 pt-7 md:px-12 md:pb-12 md:pt-9">
          <Link href="/" className="text-ink/90 transition hover:text-ink">
            <Logo className="h-6 w-6 md:h-7 md:w-7" />
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <AccountControl />
            <CartButton />
            <Link href="/" aria-label="На главную" className="text-[11px] uppercase tracking-wide2 text-ink/50 transition hover:text-ink">
              <span className="hidden sm:inline">На главную </span>✕
            </Link>
          </div>
        </header>
        {children}
      </main>
    </CartProvider>
  );
}
