"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items = [
  { href: "/admin", label: "Resumen", icon: "◧" },
  { href: "/admin/leads", label: "Leads / contactos", icon: "✉" },
  { href: "/admin/contenido", label: "Textos del sitio", icon: "✎" },
  { href: "/admin/servicios", label: "Servicios", icon: "⚙" },
  { href: "/admin/productos", label: "Productos", icon: "◆" },
  { href: "/admin/planes", label: "Planes y precios", icon: "$" },
  { href: "/admin/testimonios", label: "Testimonios", icon: "❝" },
  { href: "/admin/preguntas", label: "Preguntas frecuentes", icon: "?" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "☺" },
];

export default function Sidebar({ newLeads }: { newLeads: number }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  return (
    <>
      <button onClick={() => setOpen((o) => !o)} className="btn-outline mb-4 w-full lg:hidden">
        {open ? "Cerrar menú" : "Menú"}
      </button>
      <nav className={`${open ? "block" : "hidden"} space-y-1 lg:block`}>
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active(it.href) ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="w-4 text-center">{it.icon}</span>
            <span className="flex-1">{it.label}</span>
            {it.href === "/admin/leads" && newLeads > 0 && (
              <span className="rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold text-ink-900">{newLeads}</span>
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}
