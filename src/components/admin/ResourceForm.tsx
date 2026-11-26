import Link from "next/link";
import type { ResourceConfig } from "@/lib/resources";
import { saveResource } from "@/app/admin/actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ResourceForm({ res, item }: { res: ResourceConfig; item?: Record<string, any> | null }) {
  const action = saveResource.bind(null, res.key, item?.id ?? null);
  return (
    <form action={action} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
      {res.fields.map((f) => {
        const value = item?.[f.name];
        const id = `f-${f.name}`;
        if (f.type === "checkbox") {
          return (
            <label key={f.name} className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input type="checkbox" name={f.name} defaultChecked={item ? Boolean(value) : f.name === "published"} className="h-4 w-4 rounded border-slate-300 text-brand-600" />
              {f.label}
            </label>
          );
        }
        return (
          <div key={f.name}>
            <label htmlFor={id} className="label">
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea id={id} name={f.name} rows={f.rows ?? 4} defaultValue={value ?? ""} className="input font-[inherit]" required={f.required} />
            ) : f.type === "select" ? (
              <select id={id} name={f.name} defaultValue={value ?? f.options?.[0]?.value} className="input">
                {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input
                id={id}
                name={f.name}
                type={f.type === "number" ? "number" : f.type === "url" ? "text" : "text"}
                defaultValue={value ?? (f.type === "number" ? 0 : "")}
                className="input"
                required={f.required}
                placeholder={f.type === "url" ? "https://…" : undefined}
              />
            )}
            {f.help && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
          </div>
        );
      })}
      <div className="flex gap-3 border-t border-slate-100 pt-5">
        <button className="btn-primary">Guardar</button>
        <Link href={`/admin/${res.key}`} className="btn-outline">Cancelar</Link>
      </div>
    </form>
  );
}
