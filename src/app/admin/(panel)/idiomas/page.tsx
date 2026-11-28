import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { groqReady } from "@/lib/i18n";
import Flash from "@/components/admin/Flash";
import { redoTranslation, saveTranslation, translateEverything } from "../../actions";

const box = "rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,.04)]";

export default async function LanguagesPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string; q?: string }> }) {
  await requireAdmin();
  const { ok, error, q = "" } = await searchParams;
  const where = { lang: "en", ...(q ? { OR: [{ source: { contains: q } }, { text: { contains: q } }] } : {}) };
  const [total, manual, rows] = await Promise.all([
    prisma.translation.count({ where: { lang: "en" } }),
    prisma.translation.count({ where: { lang: "en", manual: true } }),
    prisma.translation.findMany({ where, orderBy: { updatedAt: "desc" }, take: 60 }),
  ]);
  const ready = groqReady();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink-900">Idiomas</h1>
        <p className="mt-1 text-sm text-slate-500">
          El sitio tiene versión en inglés en <a href="/en" target="_blank" className="font-medium text-ink-900 underline">aldore.co/en</a>. Cada vez que guardas algo en el panel, Groq lo traduce solo. Aquí puedes ver y corregir las traducciones.
        </p>
      </div>
      <Flash ok={ok} error={error} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={`${box} p-5`}>
          <p className="text-xs uppercase tracking-wider text-slate-500">Traductor</p>
          <p className={`mt-1 font-display text-2xl ${ready ? "text-green-700" : "text-amber-700"}`}>{ready ? "Groq activo" : "Sin clave"}</p>
          {!ready && <p className="mt-1 text-xs text-slate-500">Agrega GROQ_API_KEY en Cloudflare para traducir.</p>}
        </div>
        <div className={`${box} p-5`}>
          <p className="text-xs uppercase tracking-wider text-slate-500">Textos en inglés</p>
          <p className="mt-1 font-display text-2xl text-ink-900">{total}</p>
        </div>
        <div className={`${box} p-5`}>
          <p className="text-xs uppercase tracking-wider text-slate-500">Corregidos a mano</p>
          <p className="mt-1 font-display text-2xl text-ink-900">{manual}</p>
        </div>
      </div>

      <form action={translateEverything} className={`${box} flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between`}>
        <p className="text-sm text-slate-600">¿Primera vez o cambiaste muchas cosas? Traduce de una vez todo lo que falte. Puede tardar un minuto.</p>
        <button className="btn-primary shrink-0" disabled={!ready}>Traducir todo ahora</button>
      </form>

      <div className="space-y-3">
        <form className="flex gap-2">
          <input name="q" defaultValue={q} placeholder="Buscar un texto en español o inglés…" className="input" />
          <button className="btn-outline shrink-0">Buscar</button>
        </form>
        <div className={`divide-y divide-slate-100 ${box}`}>
          {rows.length === 0 && <p className="p-5 text-sm text-slate-500">{q ? "No hay traducciones con ese texto." : "Todavía no hay traducciones. Pulsa «Traducir todo ahora» o abre el sitio en inglés."}</p>}
          {rows.map((r) => (
            <div key={r.id} className="grid gap-3 p-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400">Español</p>
                <p className="mt-1 whitespace-pre-line text-sm text-ink-700">{r.source}</p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-400">
                  Inglés {r.manual && <span className="rounded bg-sky-50 px-1.5 py-0.5 normal-case tracking-normal text-sky-700">corregido a mano</span>}
                </p>
                <form action={saveTranslation.bind(null, r.id)} className="mt-1 space-y-2">
                  <input type="hidden" name="q" value={q} />
                  <textarea name="text" defaultValue={r.text} rows={Math.min(6, Math.max(1, Math.ceil(r.text.length / 60)))} className="input text-sm" />
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-ink-900 px-3 py-1 text-xs font-medium text-white hover:bg-brand-600">Guardar</button>
                    <button formAction={redoTranslation.bind(null, r.id)} className="rounded-lg border border-paper-line px-3 py-1 text-xs text-ink-700 hover:border-ink-900">Volver a traducir</button>
                  </div>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
