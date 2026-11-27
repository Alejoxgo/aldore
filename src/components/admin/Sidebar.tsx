"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const groups = [
  {
    title: "",
    items: [{ href: "/admin", label: "Resumen", icon: "◧" }],
  },
  {
    title: "Negocio",
    items: [
      { href: "/admin/leads", label: "Solicitudes web", icon: "✉" },
      { href: "/admin/pedidos", label: "Pedidos", icon: "▤" },
      { href: "/admin/clientes", label: "Clientes", icon: "◎" },
    ],
  },
  {
    title: "Equipo",
    items: [
      { href: "/admin/empleados", label: "Empleados", icon: "☺" },
      { href: "/admin/nomina", label: "Nómina", icon: "$" },
      { href: "/admin/solicitudes", label: "Solicitudes internas", icon: "✓" },
    ],
  },
  {
    title: "Sitio web",
    items: [
      { href: "/admin/contenido", label: "Textos del sitio", icon: "✎" },
      { href: "/admin/servicios", label: "Servicios", icon: "⚙" },
      { href: "/admin/productos", label: "Productos", icon: "◆" },
      { href: "/admin/planes", label: "Planes y precios", icon: "¤" },
      { href: "/admin/testimonios", label: "Testimonios", icon: "❝" },
      { href: "/admin/preguntas", label: "Preguntas frecuentes", icon: "?" },
    ],
  },
  {
    title: "Ajustes",
    items: [{ href: "/admin/usuarios", label: "Usuarios del panel", icon: "⚿" }],
  },
];

export default function Sidebar({ newLeads, pendingRequests = 0 }: { newLeads: number; pendingRequests?: number }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  return (
    <>
      <button onClick={() => setOpen((o) => !o)} className="btn-outline mb-4 w-full lg:hidden">
        {open ? "Cerrar menú" : "Menú"}
      </button>
      <nav className={`${open ? "block" : "hidden"} space-y-5 lg:block`}>
        {groups.map((g) => (
          <div key={g.title || "inicio"} className="space-y-1">
            {g.title && <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{g.title}</p>}
            {g.items.map((it) => {
              const badge = it.href === "/admin/leads" ? newLeads : it.href === "/admin/solicitudes" ? pendingRequests : 0;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    active(it.href) ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="w-4 text-center">{it.icon}</span>
                  <span className="flex-1">{it.label}</span>
                  {badge > 0 && <span className="rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold text-ink-900">{badge}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );
}
