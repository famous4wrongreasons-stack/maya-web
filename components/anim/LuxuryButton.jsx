"use client";

import Link from "next/link";

// Сетка кубиков для голограммы. У каждого своя фаза (delay) и темп (duration) переливания
// → перелив хаотичный. Псевдослучай детерминированный по индексу (без Math.random),
// чтобы SSR и клиент совпадали и не ломалась гидрация.
const HOLO_CUBES = Array.from({ length: 320 }, (_, i) => {
  const a = Math.abs(Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1;
  const b = Math.abs(Math.sin(i * 39.425 + 11.137) * 24634.6345) % 1;
  return { animationDelay: `-${(a * 2.6).toFixed(2)}s`, animationDuration: `${(1.4 + b * 1.7).toFixed(2)}s` };
});

// Бирюзовая «пилюля»: маленький ромб вращается на hover, подчёркивание
// раскрывается справа-налево. variant: "fill" (пилюля) | "link" (текст-ссылка).
export default function LuxuryButton({
  children,
  href,
  onClick,
  variant = "fill",
  hologram = false,
  noDiamond = false,
  icon = null,
  className = "",
  ...rest
}) {
  const inner = (
    <>
      {hologram ? (
        <span className="lux-holo" aria-hidden>
          {HOLO_CUBES.map((c, i) => (
            <i key={i} className="holo-cube" style={c} />
          ))}
        </span>
      ) : null}
      {icon ? (
        <span className="lux-icon inline-flex items-center" aria-hidden>{icon}</span>
      ) : noDiamond ? null : <span className="lux-diamond" aria-hidden />}
      <span className="lux-label">
        {children}
        <span className="lux-underline" aria-hidden />
      </span>
    </>
  );

  const cls = `lux-btn lux-${variant} ${hologram ? "lux-holobtn" : ""} ${className}`;

  if (href) {
    const external = /^https?:\/\//.test(href);
    if (external) {
      return (
        <a href={href} className={cls} target="_blank" rel="noreferrer" {...rest}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls} {...rest}>
      {inner}
    </button>
  );
}
