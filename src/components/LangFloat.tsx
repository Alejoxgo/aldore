"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/langs";

const NAMES: Record<Lang, string> = { es: "Español", en: "English", pt: "Português" };
const FLAGS: Record<Lang, string> = { es: "🇨🇴", en: "🇺🇸", pt: "🇧🇷" };

/** Selector de idioma flotante, abajo a la derecha (junto a Aldo). Recarga la página en el idioma elegido. */
export default function LangFloat({ lang, langs }: { lang: Lang; langs: Lang[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const path = (usePathname() || "/").replace(/^\/(en|es|pt)(?=\/|$)/, "") || "/";
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  if (langs.length < 2) return null;
  return (
    <div ref={ref} className="fixed bottom-5 right-[5.5rem] z-50 sm:bottom-7 sm:right-28">
      {open && (
        <ul className="absolute bottom-full right-0 mb-2 w-44 overflow-hidden rounded-2xl border border-ink-900/10 bg-white py-1 shadow-xl shadow-black/15" role="menu">
          {langs.map((l) => (
            <li key={l}>
              <a href={`/${l}${path === "/" ? "" : path}`} hrefLang={l} role="menuitem" aria-current={l === lang ? "true" : undefined} className={`flex items-center gap-2.5 px-4 py-2.5 text-sm ${l === lang ? "bg-paper font-medium text-ink-900" : "text-ink-700 hover:bg-paper"}`}>
                <span className="text-base">{FLAGS[l]}</span> {NAMES[l]}
                {l === lang && <span className="ml-auto text-brand-500">●</span>}
              </a>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Idioma / Language" className="flex h-11 items-center gap-1.5 rounded-full border border-ink-900/10 bg-white/95 pl-3 pr-3.5 font-mono text-xs font-medium text-ink-900 shadow-lg shadow-black/10 backdrop-blur transition hover:border-ink-900/30">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink-500" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z" /></svg>
        {lang.toUpperCase()}
      </button>
    </div>
  );
}
