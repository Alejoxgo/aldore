"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const nav = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/castorly", label: "Castorly" },
  { href: "/#planes", label: "Planes" },
  { href: "/#faq", label: "Preguntas" },
];

export default function Header({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-900/90 text-paper backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" aria-label={`${name}, inicio`}>
          <Logo name={name} light />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-[15px] text-paper/70 transition hover:text-paper">
              {n.label}
            </Link>
          ))}
          <Link href="/contacto" className="btn-signal !py-2">
            Hablemos
          </Link>
        </nav>
        <button
          className="rounded-lg p-2 text-paper md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 9h16M4 15h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="border-t border-white/10 bg-ink-900 md:hidden">
          <div className="container-x flex flex-col py-3">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-white/10 py-3 font-display text-2xl">
                {n.label}
              </Link>
            ))}
            <Link href="/contacto" onClick={() => setOpen(false)} className="btn-signal mt-4">
              Hablemos
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
