"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Phase = { x: number; y: number; label: string; stage: "in" | "out"; from: string; t: number };

/**
 * Transición de "puerta" al tocar un enlace del menú (los que llevan data-door).
 * Una puerta de la marca crece desde el punto que se tocó, cubre la pantalla con el nombre
 * de la sección y se abre cuando la página nueva ya está lista. Respeta prefers-reduced-motion.
 */
export default function DoorTransition() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase | null>(null);
  const ref = useRef<Phase | null>(null);
  ref.current = phase;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[data-door]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const r = a.getBoundingClientRect();
      setPhase({ x: e.clientX || r.left + r.width / 2, y: e.clientY || r.top + r.height / 2, label: a.dataset.door || a.textContent?.trim() || "", stage: "in", from: location.pathname, t: Date.now() });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Cuando cambia la ruta, la puerta se abre (espera a que termine de cerrarse).
  useEffect(() => {
    const p = ref.current;
    if (!p || p.stage !== "in" || pathname === p.from) return;
    const wait = Math.max(0, 520 - (Date.now() - p.t));
    const a = setTimeout(() => setPhase((x) => (x ? { ...x, stage: "out" } : x)), wait);
    const b = setTimeout(() => setPhase(null), wait + 700);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [pathname]);

  // Por si la navegación no llega (error o se canceló), nunca se queda la pantalla tapada.
  useEffect(() => {
    if (!phase) return;
    const t = setTimeout(() => setPhase(null), 5000);
    return () => clearTimeout(t);
  }, [phase?.t]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!phase) return null;
  const size = typeof window !== "undefined" ? Math.max(window.innerWidth, window.innerHeight) * 3.2 : 4000;
  return (
    <div className={`door-tx door-tx-${phase.stage}`} aria-hidden>
      <svg viewBox="0 0 40 40" width={size} height={size} className="door-tx-arch" style={{ left: phase.x - size / 2, top: phase.y - size * 0.05 }}>
        <path d="M5 40V21C5 11 12 5 20 2c8 3 15 9 15 19v19z" fill="#16130f" />
      </svg>
      <div className="door-tx-label font-display">
        <svg viewBox="0 0 40 40" className="door-tx-mark">
          <path d="M5 38V21C5 11 12 5 20 2c8 3 15 9 15 19v17z" fill="none" stroke="#f4f1ea" strokeWidth={2.5} />
          <path d="M15 38V25c0-4 2-7 5-9 3 2 5 5 5 9v13z" fill="#e2471c" className="door-tx-inner" />
        </svg>
        <span>{phase.label}</span>
      </div>
    </div>
  );
}
