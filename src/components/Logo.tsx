export default function Logo({ name, light = false }: { name: string; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <defs>
          <linearGradient id="nbg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3461fa" />
            <stop offset="1" stopColor="#14d1b0" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#nbg)" />
        <path d="M9.5 23 16 9l6.5 14M12 18h8" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-ink-900"}`}>{name}</span>
    </span>
  );
}
