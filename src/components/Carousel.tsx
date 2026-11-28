"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Slide = { src: string; caption?: string };

/**
 * Carrusel de capturas: desliza con el dedo, flechas, puntos y avance automático
 * (se pausa al pasar el mouse, al tocar o si el visitante prefiere menos movimiento).
 */
export default function Carousel({
  slides,
  tone = "dark",
  interval = 5000,
  label = "Capturas",
}: {
  slides: Slide[];
  tone?: "dark" | "light" | "castorly";
  interval?: number;
  label?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  const go = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el || !n) return;
      const next = ((i % n) + n) % n;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    },
    [n],
  );

  // Sincroniza el punto activo con el desplazamiento real (también al deslizar con el dedo).
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth))));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (paused || n < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go(index + 1), interval);
    return () => clearTimeout(t);
  }, [index, paused, n, interval, go]);

  if (!n) return null;

  const styles = {
    dark: { frame: "border-white/10 bg-white/5", cap: "text-paper/60", btn: "bg-ink-900/75 text-paper ring-1 ring-white/20 hover:bg-ink-900", dot: "bg-paper", dotOff: "bg-paper/25" },
    light: { frame: "border-paper-line bg-white", cap: "text-ink-500", btn: "bg-white/90 text-ink-900 shadow ring-1 ring-ink-900/10 hover:bg-white", dot: "bg-ink-900", dotOff: "bg-ink-900/20" },
    castorly: { frame: "border-white/15 bg-white/5 shadow-2xl shadow-[#050a2e]/60", cap: "text-[#c9d3ff]", btn: "bg-[#0D1A4A]/75 text-white ring-1 ring-white/25 hover:bg-[#0D1A4A]", dot: "bg-[#6FE3FF]", dotOff: "bg-white/25" },
  }[tone];

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={track}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((g, i) => (
          <figure
            key={g.src + i}
            className="w-full shrink-0 snap-center px-0.5"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${n}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.src}
              alt={g.caption || label}
              loading={i === 0 ? "eager" : "lazy"}
              className={`aspect-[16/9] w-full rounded-2xl border object-cover object-top ${styles.frame}`}
            />
            {g.caption && <figcaption className={`mt-4 text-center text-sm sm:text-base ${styles.cap}`}>{g.caption}</figcaption>}
          </figure>
        ))}
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Anterior"
            className={`absolute left-3 top-[calc(50%-1.5rem)] hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full backdrop-blur transition sm:grid ${styles.btn}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Siguiente"
            className={`absolute right-3 top-[calc(50%-1.5rem)] hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full backdrop-blur transition sm:grid ${styles.btn}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
          </button>
          <div className="mt-5 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Ir a la captura ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${i === index ? `w-7 ${styles.dot}` : `w-2 ${styles.dotOff}`}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
