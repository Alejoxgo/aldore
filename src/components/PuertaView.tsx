"use client";
import { useState } from "react";
import PuertaIcon from "./PuertaIcon";
import type { PuertaButton } from "@/lib/puerta";

export type PuertaData = {
  name: string;
  subtitle: string;
  logoUrl: string;
  color: string;
  theme: string;
  buttons: (PuertaButton & { link: string })[];
  wifiName: string;
  wifiPass: string;
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/** Página de un toque. Se usa en /p/[slug] y como vista previa en el sitio y el panel. */
export default function PuertaView({ data, preview = false }: { data: PuertaData; preview?: boolean }) {
  const [wifiOpen, setWifiOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const light = data.theme === "claro";
  const c = data.color || "#e2471c";

  const base = light ? "bg-[#f4f1ea] text-[#16130f]" : "bg-[#16130f] text-[#f4f1ea]";
  const card = light ? "bg-white border-black/[0.07] hover:border-black/20" : "bg-white/[0.04] border-white/10 hover:border-white/25";
  const muted = light ? "text-black/50" : "text-white/50";

  return (
    <div className={`relative flex min-h-full flex-col items-center overflow-hidden px-5 pb-8 pt-12 ${base}`}>
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ background: c }} />
      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          {data.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.logoUrl} alt={data.name} className="h-24 w-24 rounded-full object-cover shadow-xl ring-4 ring-white/10" />
          ) : (
            <span className="grid h-24 w-24 place-items-center rounded-full font-display text-3xl font-semibold text-white shadow-xl" style={{ background: c }}>
              {initials(data.name)}
            </span>
          )}
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">{data.name}</h1>
          {data.subtitle && <p className={`mt-1 text-sm ${muted}`}>{data.subtitle}</p>}
        </div>

        <ul className="mt-8 space-y-3">
          {data.buttons.map((b, i) => {
            const inner = (
              <>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white" style={{ background: c }}>
                  <PuertaIcon name={b.icon} />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate font-semibold">{b.title}</span>
                  {b.subtitle && <span className={`block truncate text-[13px] ${muted}`}>{b.subtitle}</span>}
                </span>
                <span className={muted} aria-hidden="true">›</span>
              </>
            );
            const cls = `flex w-full items-center gap-3.5 rounded-2xl border p-3 transition active:scale-[0.98] ${card}`;
            if (b.href === "wifi") {
              return (
                <li key={i}>
                  <button type="button" className={cls} onClick={() => setWifiOpen((o) => !o)}>{inner}</button>
                  {wifiOpen && (
                    <div className={`mt-2 rounded-2xl border p-4 text-sm ${card}`}>
                      <p className={muted}>Red</p>
                      <p className="font-mono font-semibold">{data.wifiName || "—"}</p>
                      <p className={`mt-3 ${muted}`}>Clave</p>
                      <div className="flex items-center justify-between gap-3">
                        <p className="break-all font-mono font-semibold">{data.wifiPass || "Sin clave"}</p>
                        {data.wifiPass && (
                          <button
                            type="button"
                            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                            style={{ background: c }}
                            onClick={() => {
                              navigator.clipboard?.writeText(data.wifiPass).then(() => setCopied(true), () => {});
                            }}
                          >
                            {copied ? "¡Copiada!" : "Copiar"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            }
            return (
              <li key={i}>
                <a href={preview ? undefined : b.link} target={b.link.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer" className={cls}>
                  {inner}
                </a>
              </li>
            );
          })}
        </ul>

        <a href="https://aldore.co/puerta" className={`mt-10 flex items-center justify-center gap-1.5 text-[11px] ${muted} hover:opacity-80`}>
          <svg viewBox="0 0 40 40" className="h-3 w-3" aria-hidden="true">
            <path d="M5 38V21C5 11 12 5 20 2c8 3 15 9 15 19v17z" fill="currentColor" />
            <path d="M15 38V25c0-4 2-7 5-9 3 2 5 5 5 9v13z" fill="#e2471c" />
          </svg>
          Puerta by Aldore
        </a>
      </div>
    </div>
  );
}
