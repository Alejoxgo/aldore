import Link from "next/link";
import { prisma } from "@/lib/db";
import { STATUS_STYLES } from "@/lib/leads";

export default async function Dashboard() {
  const [leads, newLeads, services, products, plans, latest] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "nuevo" } }),
    prisma.service.count(),
    prisma.product.count(),
    prisma.plan.count(),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);
  const cards = [
    { label: "Leads nuevos", value: newLeads, href: "/admin/leads?estado=nuevo" },
    { label: "Leads totales", value: leads, href: "/admin/leads" },
    { label: "Servicios", value: services, href: "/admin/servicios" },
    { label: "Productos", value: products, href: "/admin/productos" },
    { label: "Planes", value: plans, href: "/admin/planes" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Resumen</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-300">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-ink-900">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="font-semibold text-ink-900">Últimos contactos</h2>
          <Link href="/admin/leads" className="text-sm font-medium text-brand-600">Ver todos →</Link>
        </div>
        {latest.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">Aún no hay contactos. Llegarán aquí desde el formulario del sitio.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {latest.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leads/${l.id}`} className="flex flex-wrap items-center gap-3 p-5 hover:bg-slate-50">
                  <span className="font-medium text-ink-900">{l.name}</span>
                  <span className="text-sm text-slate-500">{l.email}</span>
                  {l.service && <span className="text-sm text-slate-500">· {l.service}</span>}
                  <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[l.status] ?? ""}`}>{l.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Editar textos de la portada", "/admin/contenido"],
          ["Agregar un servicio", "/admin/servicios/nuevo"],
          ["Editar Castorly", "/admin/productos"],
        ].map(([l, h]) => (
          <Link key={h} href={h} className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-700">
            + {l}
          </Link>
        ))}
      </div>
    </div>
  );
}
