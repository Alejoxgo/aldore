import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClientId } from "@/lib/client-session";
import PortalView from "@/components/portal/PortalView";
import { changeMyPortalPassword, clientLogout, toggleMyQueue, updateMyPuerta } from "./actions";

export const metadata: Metadata = { title: "Mi portal", robots: { index: false, follow: false } };

export default async function MyPortal({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const cid = await getClientId();
  if (!cid) redirect("/portal/ingresar");
  const client = await prisma.client.findUnique({ where: { id: cid } });
  if (!client || !client.portalHash) redirect("/portal/ingresar");
  const { ok, error } = await searchParams;
  const [puertas, queues] = await Promise.all([
    prisma.linkPage.findMany({ where: { clientId: cid } }),
    prisma.queue.findMany({ where: { clientId: cid } }),
  ]);
  return (
    <PortalView
      client={client}
      account
      headerAction={
        <form action={clientLogout}>
          <button className="rounded-full border border-white/15 px-3 py-1 text-xs text-paper/80 hover:border-white/40 hover:text-white">Salir</button>
        </form>
      }
    >
      {(ok || error) && <p className={`rounded-2xl px-4 py-3 text-sm font-medium ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{error || ok}</p>}

      {puertas.length > 0 && (
        <section>
          <h2 className="font-display text-3xl text-ink-900">Edita tu Puerta</h2>
          <p className="mt-1 text-ink-500">Los cambios se ven de inmediato cuando alguien escanea tu QR o toca tu NFC.</p>
          <div className="mt-6 space-y-5">
            {puertas.map((p) => (
              <form key={p.id} action={updateMyPuerta.bind(null, p.id)} className="grid gap-4 rounded-3xl border border-paper-line bg-white p-6 sm:grid-cols-2 sm:p-8">
                <label className="text-sm"><span className="label">Nombre</span><input name="name" defaultValue={p.name} className="input" /></label>
                <label className="text-sm"><span className="label">Texto bajo el nombre</span><input name="subtitle" defaultValue={p.subtitle} className="input" /></label>
                <label className="text-sm sm:col-span-2">
                  <span className="label">Botones</span>
                  <textarea name="buttons" defaultValue={p.buttons} rows={7} className="input font-mono text-[13px]" />
                  <span className="mt-1 block text-xs text-ink-500">Un botón por línea: <code>tipo | Título | Texto pequeño | enlace o número</code>. Tipos: carta, whatsapp, resena, reservar, pago, instagram, facebook, tiktok, mapa, web, llamar, link.</span>
                </label>
                <label className="text-sm"><span className="label">Nombre del wifi</span><input name="wifiName" defaultValue={p.wifiName} className="input" /></label>
                <label className="text-sm"><span className="label">Clave del wifi</span><input name="wifiPass" defaultValue={p.wifiPass} className="input" /></label>
                <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
                  <button className="btn-signal">Guardar mi Puerta</button>
                  <a href={`/p/${p.slug}`} target="_blank" className="text-sm font-medium text-ink-700">Ver cómo quedó ↗</a>
                </div>
              </form>
            ))}
          </div>
        </section>
      )}

      {queues.length > 0 && (
        <section>
          <h2 className="font-display text-3xl text-ink-900">Tus turnos</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {queues.map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-4 rounded-2xl border border-paper-line bg-white p-5">
                <div>
                  <p className="font-display text-xl text-ink-900">{q.name}</p>
                  <p className={`text-sm ${q.open ? "text-emerald-700" : "text-ink-500"}`}>{q.open ? "● Abierta: la gente puede tomar turno" : "Cerrada"}</p>
                </div>
                <form action={toggleMyQueue.bind(null, q.id)}><button className="btn-outline !py-2 text-sm">{q.open ? "Cerrar" : "Abrir"}</button></form>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <details className="rounded-3xl border border-paper-line bg-white p-6">
          <summary className="cursor-pointer font-medium text-ink-900">Cambiar mi contraseña</summary>
          <form action={changeMyPortalPassword} className="mt-4 grid gap-3 sm:grid-cols-3">
            <input name="current" type="password" placeholder="Contraseña actual" className="input" required autoComplete="current-password" />
            <input name="next" type="password" placeholder="Nueva (mín. 8)" minLength={8} className="input" required autoComplete="new-password" />
            <button className="btn-primary">Actualizar</button>
          </form>
        </details>
      </section>
    </PortalView>
  );
}
