"use client";
import { useEffect, useRef } from "react";

export type AldoPose = "base" | "wave" | "think" | "code" | "happy" | "fly" | "cheer";

// Alas abiertas (volando) y alas arriba (celebrando).
const FLY_L = "M27 74C14 60 1 56-9 60c6 6 10 14 12 22 7-2 15-4 24 4z";
const FLY_R = "M93 74c13-14 26-18 36-14-6 6-10 14-12 22-7-2-15-4-24 4z";
const UP_L = "M26 76C16 66 12 52 14 40c6 8 11 18 14 30z";
const UP_R = "M94 76c10-10 14-24 12-36-6 8-11 18-14 30z";

const INK = "#16130f";
const V = "#e2471c";
const P = "#f4f1ea";

/**
 * Aldo, el búho de Aldore. SVG animado con CSS:
 * respira, parpadea, sigue el cursor con la mirada y saluda.
 * Todas las animaciones se apagan con prefers-reduced-motion.
 */
export default function Aldo({
  pose = "base",
  className = "h-40 w-40",
  follow = true,
  title = "Aldo, el búho de Aldore",
  onDark = false,
}: {
  pose?: AldoPose;
  className?: string;
  follow?: boolean;
  title?: string;
  /** Añade un borde claro para que se vea sobre fondos oscuros. */
  onDark?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!follow || pose === "happy") return;
    const svg = ref.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = svg.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.35;
        const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 300));
        const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 300));
        svg.style.setProperty("--px", `${dx * 3.2}px`);
        svg.style.setProperty("--py", `${dy * 3}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [follow, pose]);

  // Contorno claro alrededor de la silueta para que Aldo no se pierda sobre fondos oscuros.
  // paint-order "stroke" deja el trazo detrás del relleno: solo se ve la mitad de afuera.
  // Se dibuja primero una copia de la silueta con un trazo grueso claro, y encima las piezas normales.
  const edge = { fill: P, stroke: P, strokeWidth: onDark ? 6 : 5, strokeLinejoin: "round" as const };

  const eyesOpen = (
    <g className="aldo-blink">
      <circle cx="46" cy="46" r="12" fill={P} />
      <circle cx="74" cy="46" r="12" fill={P} />
      <g className="aldo-pupils">
        <circle cx="47" cy={pose === "think" ? 43 : 47} r="5.5" fill={INK} />
        <circle cx="73" cy={pose === "think" ? 43 : 47} r="5.5" fill={INK} />
        <circle cx="49" cy={pose === "think" ? 41 : 45} r="1.8" fill={P} />
        <circle cx="75" cy={pose === "think" ? 41 : 45} r="1.8" fill={P} />
      </g>
    </g>
  );
  const eyesHappy = (
    <g>
      <circle cx="46" cy="46" r="12" fill={P} />
      <circle cx="74" cy="46" r="12" fill={P} />
      <path d="M40 49q6-8 12 0M68 49q6-8 12 0" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>
  );

  return (
    <svg
      ref={ref}
      viewBox="0 -14 124 144"
      className={`aldo aldo-pose-${pose} ${className}`}
      role="img"
      aria-label={title}
    >
      <ellipse className="aldo-shadow" cx="60" cy="124" rx="34" ry="4" fill={onDark ? "#000" : INK} opacity={onDark ? 0.35 : 0.14} />

      {pose === "think" && (
        <g className="aldo-bubble">
          <circle cx="100" cy="10" r="2.5" fill={INK} opacity=".45" />
          <circle cx="106" cy="2" r="3.5" fill={INK} opacity=".45" />
          <text x="100" y="-5" fontFamily="JetBrains Mono, monospace" fontSize="10" fill={V}>{"{ }"}</text>
        </g>
      )}

      <g className="aldo-body" aria-hidden>
        <g className="aldo-head"><path d="M24 114V66C24 47 29 37 35 30L31 10 49 23Q60 19 71 23L89 10 85 30C91 37 96 47 96 66v48z" {...edge} /></g>
        {!["code", "fly", "cheer"].includes(pose) && <path className="aldo-wing-l" d="M25 72c-10 8-12 22-4 34 3-12 6-22 4-34z" {...edge} />}
        {pose === "fly" && <><path className="aldo-flap-l" d={FLY_L} {...edge} /><path className="aldo-flap-r" d={FLY_R} {...edge} /></>}
        {pose === "cheer" && <><path className="aldo-cheer-l" d={UP_L} {...edge} /><path className="aldo-cheer-r" d={UP_R} {...edge} /></>}
        {pose === "think" && <path d="M95 76c8 2 8 10 2 14" stroke={P} strokeWidth={onDark ? 11 : 10} fill="none" strokeLinecap="round" />}
        {(pose === "base" || pose === "happy") && <path className="aldo-wing-r" d="M95 72c10 8 12 22 4 34-3-12-6-22-4-34z" {...edge} />}
        {pose === "wave" && <g className="aldo-wave"><path d="M95 74c10-6 16-20 14-34-6 8-11 20-14 34z" {...edge} /></g>}
      </g>

      <g className="aldo-body">
        {/* cuerpo con orejas: el arco del logo */}
        <g className="aldo-head">
          <path d="M24 114V66C24 47 29 37 35 30L31 10 49 23Q60 19 71 23L89 10 85 30C91 37 96 47 96 66v48z" fill={INK} />
          <path d="M41 114V90c0-10 8-16 19-20 11 4 19 10 19 20v24z" fill={V} />
          <path
            d="M52 88l4 4 4-4 4 4 4-4M48 98l4 4 4-4 4 4 4-4 4 4 4-4"
            stroke={P}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".7"
          />
          {pose === "happy" || pose === "cheer" ? eyesHappy : eyesOpen}
          {pose === "code" && (
            <g>
              <circle cx="46" cy="46" r="13.5" fill="none" stroke={V} strokeWidth="2.5" />
              <circle cx="74" cy="46" r="13.5" fill="none" stroke={V} strokeWidth="2.5" />
              <path d="M59 45h2" stroke={V} strokeWidth="2.5" />
            </g>
          )}
          <path d="M55 57h10l-5 8z" fill={V} />
        </g>

        {/* alas */}
        {!["code", "fly", "cheer"].includes(pose) && <path className="aldo-wing-l" d="M25 72c-10 8-12 22-4 34 3-12 6-22 4-34z" fill={INK} />}
        {pose === "fly" && <><path className="aldo-flap-l" d={FLY_L} fill={INK} /><path className="aldo-flap-r" d={FLY_R} fill={INK} /></>}
        {pose === "cheer" && (
          <>
            <path className="aldo-cheer-l" d={UP_L} fill={INK} />
            <path className="aldo-cheer-r" d={UP_R} fill={INK} />
            <path d="M8 34l-4-3M10 26l-2-5M112 34l4-3M110 26l2-5" stroke={V} strokeWidth="2.5" strokeLinecap="round" className="aldo-sparks" />
          </>
        )}
        {(pose === "base" || pose === "happy") && <path className="aldo-wing-r" d="M95 72c10 8 12 22 4 34-3-12-6-22-4-34z" fill={INK} />}
        {pose === "wave" && (
          <g className="aldo-wave">
            <path d="M95 74c10-6 16-20 14-34-6 8-11 20-14 34z" fill={INK} />
            <path d="M114 32l4-4M118 42l5-1M108 28v-6" stroke={V} strokeWidth="2.5" strokeLinecap="round" className="aldo-sparks" />
          </g>
        )}
        {pose === "think" && <path d="M95 76c8 2 8 10 2 14" stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />}
      </g>

      {pose === "code" ? (
        <g>
          <path className="aldo-typing" d="M24 86c-8 6-6 14 6 14M96 86c8 6 6 14-6 14" stroke={P} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path className="aldo-typing" d="M24 86c-8 6-6 14 6 14M96 86c8 6 6 14-6 14" stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M18 98h84l-8 18H26z" fill="#3a342c" />
          <rect x="24" y="96" width="72" height="4" rx="2" fill="#6b6358" />
          <text x="50" y="111" fontFamily="JetBrains Mono, monospace" fontSize="8" fill={V} className="aldo-cursor">{"</>"}</text>
        </g>
      ) : (
        <path className="aldo-feet" d={pose === "fly" ? "M46 114l-2 4M50 114l-1 4M54 114v4M66 114v4M70 114l1 4M74 114l2 4" : "M44 114v6M48 114v6M52 114v6M68 114v6M72 114v6M76 114v6"} stroke={V} strokeWidth="3" strokeLinecap="round" />
      )}
    </svg>
  );
}
