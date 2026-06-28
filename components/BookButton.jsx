import Link from "next/link";

// Логотип YClients — как на кнопке записи в приложении (BookBtn в app.html).
function YclientsMark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className="shrink-0" style={{ color: "inherit" }}>
      <polygon points="15,19 31,19 23,37" fill="currentColor" />
      <polygon points="35,19 52,19 30,53 20,45" fill="currentColor" />
    </svg>
  );
}

// Единая кнопка «Записаться» (нативная запись YClients) — жёлтое оформление + логотип,
// идентично главной кнопке записи в приложении. Размеры/радиус задаются через className.
export default function BookButton({ children = "Записаться", className = "", iconSize = 18, ...rest }) {
  return (
    <Link href="/booking" className={`book-btn ${className}`} {...rest}>
      <YclientsMark size={iconSize} />
      <span>{children}</span>
    </Link>
  );
}
