import Link from "next/link";
import { prisma } from "@/lib/db";
import { STATUS_STYLES } from "@/lib/leads";
import { STATUS_COLORS } from "@/lib/resources";
import { currentPeriod, money, shortDate } from "@/lib/format";

export default async function Dashboard() {
  const period = currentPeriod();
  const today = new Date().toISOString().slice(0, 10);
  const [newLeads, openOrders, employees, payroll, pendingReqs, latestLeads, upcoming, reqs] = await Promise.all([
    prisma.lead.count({ where: { status: "nuevo" } }),
    prisma.order.findMany({ where: { status: { notIn: ["cancelado"] } }, select: { amount: true, paid: true, status: true } }),
    prisma.employee.count({ where: { active: true } }),
    prisma.payroll.findMany({ where: { period }, select: { net: true, status: true } }),
    prisma.staffRequest.count({ where: { status: "pendiente" } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.order.findMany({
      where: { status: { in: ["aprobado", "en_progreso"] } },
      orderBy: [{ dueDate: "asc" }],
      take: 6,
      include: { client: { select: { name: true } } },
    }),
    prisma.staffRequest.findMany({ where: { status: "pendiente" }, orderBy: { createdAt: "desc" }, take: 5, include: { employee: { select: { name: true } } } }),
  ]);

  const active = openOrders.filter((o) => ["aprobado", "en_progreso"].includes(o.status)).length;
  const receivable = openOrders.filter((o) => o.status !== "cotizacion").reduce((a, o) => a + Math.max(0, o.amount - o.paid), 0);
  const payrollTotal = payroll.reduce((a, p) => a + p.net, 0);
  const payrollPending = payroll.filter((p) => p.status !== "pagado").reduce((a, p) => a + p.net, 0);

  const cards = [
    { label: "Solicitudes web nuevas", value: String(newLeads), href: "/admin/leads?estado=nuevo" },
    { label: "Pedidos en curso", value: String(active), href: "/admin/pedidos?estado=en_progreso" },
    { label: "Por cobrar", value: money(receivable), href: "/admin/pedidos" },
    { label: "Empleados activos", value: String(employees), href: "/admin/empleados" },
    {
      label: `Nómina ${shortDate(period)}`,
      value: money(payrollTotal),
      sub: payroll.length === 0 ? "Sin generar" : payrollPending > 0 ? `${money(payrollPending)} por pagar` : "Todo pagado",
      href: `/admin/nomina?periodo=${period}`,
    },
    { label: "Solicitudes internas", value: String(pendingReqs), sub: "pendientes", href: "/admin/solicitudes?estado=pendiente" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Resumen</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-300">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 truncate text-3xl font-bold tabular-nums text-ink-900">{c.value}</p>
            {c.sub && <p className="mt-1 text-xs text-slate-500">{c.sub}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Entregas próximas" href="/admin/pedidos" empty="No hay pedidos aprobados o en curso.">
          {upcoming.map((o) => (
            <Item key={o.id} href={`/admin/pedidos/${o.id}`}>
              <span className="font-medium text-ink-900">{o.title}</span>
              {o.client && <span className="text-slate-500">{o.client.name}</span>}
              <span className={`ml-auto text-xs ${o.dueDate && o.dueDate < today ? "font-semibold text-red-600" : "text-slate-500"}`}>
                {o.dueDate ? shortDate(o.dueDate) : "Sin fecha"}
              </span>
            </Item>
          ))}
        </Panel>
        <Panel title="Solicitudes web recientes" href="/admin/leads" empty="Aún no hay contactos. Llegarán aquí desde el formulario del sitio.">
          {latestLeads.map((l) => (
            <Item key={l.id} href={`/admin/leads/${l.id}`}>
              <span className="font-medium text-ink-900">{l.name}</span>
              {l.service && <span className="text-slate-500">{l.service}</span>}
              <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[l.status] ?? ""}`}>{l.status}</span>
            </Item>
          ))}
        </Panel>
        <Panel title="Solicitudes del equipo por revisar" href="/admin/solicitudes?estado=pendiente" empty="No hay solicitudes pendientes.">
          {reqs.map((r) => (
            <Item key={r.id} href={`/admin/solicitudes/${r.id}`}>
              <span className="font-medium text-ink-900">{r.title}</span>
              {r.employee && <span className="text-slate-500">{r.employee.name}</span>}
              <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[r.status]}`}>{r.status}</span>
            </Item>
          ))}
        </Panel>
        <div className="grid content-start gap-3 sm:grid-cols-2">
          {[
            ["Nuevo pedido", "/admin/pedidos/nuevo"],
            ["Nuevo cliente", "/admin/clientes/nuevo"],
            ["Nuevo empleado", "/admin/empleados/nuevo"],
            ["Generar nómina del mes", "/admin/nomina"],
            ["Editar textos del sitio", "/admin/contenido"],
            ["Editar Castorly", "/admin/productos"],
          ].map(([l, h]) => (
            <Link key={h} href={h} className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-700">
              + {l}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, href, empty, children }: { title: string; href: string; empty: string; children: React.ReactNode[] }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="font-semibold text-ink-900">{title}</h2>
        <Link href={href} className="text-sm font-medium text-brand-600">Ver todo →</Link>
      </div>
      {children.length === 0 ? <p className="p-5 text-sm text-slate-500">{empty}</p> : <ul className="divide-y divide-slate-100">{children}</ul>}
    </section>
  );
}

function Item({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 text-sm hover:bg-slate-50">{children}</Link>
    </li>
  );
}
