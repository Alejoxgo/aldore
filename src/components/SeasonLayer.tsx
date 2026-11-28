import type { Particle } from "@/lib/season";

const N = 18;

/** Lluvia suave de la temporada (nieve, murciélagos, corazones, confeti o flores). Decorativa y sin clics. */
export default function SeasonLayer({ particle, colors }: { particle: Particle; colors: string[] }) {
  const items = Array.from({ length: N }, (_, i) => {
    const left = (i * 53) % 100;
    const delay = (i * 1.7) % 12;
    const dur = 9 + ((i * 7) % 8);
    const size = particle === "snow" ? 6 + ((i * 3) % 7) : 12 + ((i * 5) % 10);
    const color = colors[i % colors.length];
    return { left, delay, dur, size, color, i };
  });
  const shape = (c: string, i: number) => {
    switch (particle) {
      case "snow":
        return <circle cx="12" cy="12" r="10" fill="#fff" stroke="rgba(22,19,15,.08)" />;
      case "hearts":
        return <path d="M12 21C5 15 1 11 3 6.5 5 2.5 10 3 12 7c2-4 7-4.5 9-.5 2 4.5-2 8.5-9 14.5z" fill={c} />;
      case "bats":
        return <path d="M12 9c-1-2-3-2-3-2s-1 2-4 1c-1 2-3 2-5 2 2 1 3 3 3 5 2-1 4-1 5 1 1-1 2-2 4-2s3 1 4 2c1-2 3-2 5-1 0-2 1-4 3-5-2 0-4 0-5-2-3 1-4-1-4-1s-2 0-3 2z" fill="#2e1065" />;
      case "flowers":
        return (
          <g fill={c}>
            {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx="12" cy="6" rx="3.5" ry="5.5" transform={`rotate(${r} 12 12)`} />)}
            <circle cx="12" cy="12" r="3" fill="#fde047" />
          </g>
        );
      default:
        return <rect x="7" y="3" width="10" height="18" rx="2" fill={c} transform={`rotate(${(i * 37) % 90} 12 12)`} />;
    }
  };
  return (
    <div aria-hidden className={`season-layer season-${particle}`}>
      {items.map((p) => (
        <span key={p.i} style={{ left: `${p.left}%`, width: p.size, height: p.size, animationDelay: `-${p.delay}s`, animationDuration: `${p.dur}s` }}>
          <svg viewBox="0 0 24 24" width="100%" height="100%">{shape(p.color, p.i)}</svg>
        </span>
      ))}
    </div>
  );
}
