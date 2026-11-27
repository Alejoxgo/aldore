import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getResource } from "@/lib/resources";
import Flash from "@/components/admin/Flash";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteResource, toggleResource } from "../../actions";

type Props = { params: Promise<{ resource: string }>; searchParams: Promise<{ ok?: string; error?: string }> };

export default async function ResourceList({ params, searchParams }: Props) {
  const res = getResource((await params).resource);
  if (!res) notFound();
  const { ok, error } = await searchParams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: any[] = await (prisma as any)[res.model].findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{res.label}</h1>
          <p className="mt-1 text-sm text-slate-500">{res.description}</p>
        </div>
        <Link href={`/admin/${res.key}/nuevo`} className="btn-primary">+ Nuevo {res.singular}</Link>
      </div>
      <Flash ok={ok} error={error} />
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              {res.columns.map((c) => <th key={c.name} className="px-4 py-3 font-semibold">{c.label}</th>)}
              <th className="px-4 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 && (
              <tr><td colSpan={res.columns.length + 1} className="px-4 py-8 text-center text-slate-500">No hay registros todavía.</td></tr>
            )}
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-slate-50">
                {res.columns.map((c, i) => {
                  const v = it[c.name];
                  if (c.name === "published") {
                    return (
                      <td key={c.name} className="px-4 py-3">
                        <form action={toggleResource.bind(null, res.key, it.id, !v)}>
                          <button className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${v ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`} title="Cambiar visibilidad">
                            {v ? "Visible" : "Oculto"}
                          </button>
                        </form>
                      </td>
                    );
                  }
                  return (
                    <td key={c.name} className={`px-4 py-3 ${i === 0 ? "font-medium text-ink-900" : "text-slate-600"}`}>
                      {typeof v === "boolean" ? (v ? "Sí" : "—") : i === 0 ? <Link href={`/admin/${res.key}/${it.id}`} className="hover:text-brand-700">{String(v)}</Link> : String(v ?? "")}
                    </td>
                  );
                })}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/${res.key}/${it.id}`} className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium hover:bg-white">Editar</Link>
                    <form action={deleteResource.bind(null, res.key, it.id)}>
                      <ConfirmButton message="¿Eliminar este registro? Esta acción no se puede deshacer." className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                        Eliminar
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
