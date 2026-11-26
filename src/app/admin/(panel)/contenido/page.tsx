import { SETTINGS_GROUPS, getSettings } from "@/lib/settings";
import Flash from "@/components/admin/Flash";
import { saveSettings } from "../../actions";

export default async function ContentPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const s = await getSettings();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-ink-900">Textos del sitio</h1>
      <p className="mb-6 mt-1 text-sm text-slate-500">Edita los títulos, textos, datos de contacto y redes sociales. Los cambios se ven de inmediato. En los títulos puedes encerrar una palabra entre *asteriscos* para resaltarla.</p>
      <Flash ok={ok} />
      <div className="mb-6 flex flex-wrap gap-2">
        {SETTINGS_GROUPS.map((g) => (
          <a key={g.id} href={`#${g.id}`} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-brand-400">{g.title}</a>
        ))}
      </div>
      <div className="space-y-8">
        {SETTINGS_GROUPS.map((g) => (
          <form key={g.id} id={g.id} action={saveSettings} className="scroll-mt-24 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
            <input type="hidden" name="_group" value={g.id} />
            <div>
              <h2 className="text-lg font-semibold text-ink-900">{g.title}</h2>
              {g.description && <p className="text-sm text-slate-500">{g.description}</p>}
            </div>
            {g.fields.map((f) => (
              <div key={f.key}>
                <label className="label" htmlFor={f.key}>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea id={f.key} name={f.key} defaultValue={s[f.key]} rows={f.key === "process.steps" ? 5 : 3} className="input" />
                ) : (
                  <input id={f.key} name={f.key} defaultValue={s[f.key]} className="input" placeholder={f.type === "url" ? "https://…" : undefined} />
                )}
                {f.help && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
              </div>
            ))}
            <button className="btn-primary">Guardar «{g.title}»</button>
          </form>
        ))}
      </div>
    </div>
  );
}
