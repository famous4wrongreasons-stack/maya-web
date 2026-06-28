// Анимированный AI-орб Maya: переливается сине-белым с бликами,
// вокруг — вращающиеся кольца и орбиты. Чисто CSS-анимации.
export default function AiOrb({ className = "" }) {
  return (
    <div className={`relative aspect-square ${className}`}>
      {/* свечение */}
      <div className="absolute inset-[24%] rounded-full opacity-70 blur-3xl" style={{ background: "radial-gradient(circle, rgba(61, 139, 240,0.6), transparent 65%)" }} />

      {/* ядро: блик движется, цвет переливается */}
      <div className="absolute inset-[26%] overflow-hidden rounded-full" style={{ animation: "orbShimmer 6s ease-in-out infinite" }}>
        <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 40% 34%, #dbeaff, #3d8bf0 52%, #1e5fd0 100%)" }} />
        <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.95), rgba(255,255,255,0) 44%)", animation: "orbDrift 4.5s ease-in-out infinite" }} />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: "inset 0 0 30px 4px rgba(47,134,224,0.5)" }} />
      </div>

      {/* кольца */}
      <div className="absolute inset-[14%] rounded-full border border-maya/25" style={{ animation: "spinSlow 20s linear infinite" }}>
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#3d8bf0] shadow-[0_0_12px_3px_rgba(61, 139, 240,0.7)]" />
      </div>
      <div className="absolute inset-[5%] rounded-full border border-dashed border-ink/10" style={{ animation: "spinRev 28s linear infinite" }}>
        <span className="absolute top-1/2 -right-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-ink/70" />
      </div>
      <div className="absolute inset-0 rounded-full border border-ink/[0.06]" />
    </div>
  );
}
