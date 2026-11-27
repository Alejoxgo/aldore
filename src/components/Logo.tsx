/** Logo de Aldore: un arco ojival (la «A» y una puerta) con la entrada en bermellón. */
export function LogoMark({ className = "h-8 w-8", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M5 38V21C5 11 12 5 20 2c8 3 15 9 15 19v17z" fill={light ? "#f4f1ea" : "#16130f"} />
      <path d="M15 38V25c0-4 2-7 5-9 3 2 5 5 5 9v13z" fill="#e2471c" />
    </svg>
  );
}

export default function Logo({ name, light = false }: { name: string; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark light={light} className="h-8 w-8" />
      <span className={`font-serif text-[1.65rem] font-semibold lowercase leading-none tracking-tight ${light ? "text-paper" : "text-ink-900"}`}>
        {name}
        <span className="text-brand-500">.</span>
      </span>
    </span>
  );
}
