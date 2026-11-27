import Link from "next/link";
import PuertaView from "./PuertaView";
import { Emph } from "./Sections";
import { DEMO_BUTTONS, parseButtons } from "@/lib/puerta";
import { lines } from "@/lib/utils";
import type { Settings } from "@/lib/settings";

const demo = {
  name: "La Esquina Café",
  subtitle: "Sabaneta · Café de origen",
  logoUrl: "",
  color: "#e2471c",
  theme: "oscuro",
  buttons: parseButtons(DEMO_BUTTONS).map((b) => ({ ...b, link: "#" })),
  wifiName: "LaEsquina_Clientes",
  wifiPass: "cafecito2026",
};

/** Celular con una Puerta de ejemplo, con el sticker NFC al lado. */
export function PuertaPhone({ className = "" }: { className?: string }) {
  return (
    <div className={`relative mx-auto w-[290px] ${className}`}>
      <div className="relative overflow-hidden rounded-[2.6rem] border-[10px] border-[#2a2520] bg-[#16130f] shadow-2xl shadow-black/50">
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#2a2520]" />
        <div className="h-[560px] overflow-hidden">
          <PuertaView data={demo} preview />
        </div>
      </div>
      <div className="absolute -left-14 bottom-16 hidden rotate-[-8deg] sm:block" aria-hidden="true">
        <div className="grid h-24 w-24 place-items-center rounded-full border border-white/15 bg-paper text-ink-900 shadow-xl">
          <div className="text-center">
            <svg viewBox="0 0 40 40" className="mx-auto h-7 w-7">
              <path d="M5 38V21C5 11 12 5 20 2c8 3 15 9 15 19v17z" fill="#16130f" />
              <path d="M15 38V25c0-4 2-7 5-9 3 2 5 5 5 9v13z" fill="#e2471c" />
            </svg>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider">Acerca tu celular</p>
          </div>
        </div>
        <span className="absolute -right-3 top-1/2 h-px w-6 animate-pulse bg-brand-500" />
      </div>
    </div>
  );
}

export function parsePlans(value?: string) {
  return lines(value).map((l) => {
    const [name, price, note, incl] = l.split("|").map((x) => x.trim());
    return { name, price, note, features: (incl ?? "").split(";").map((x) => x.trim()).filter(Boolean) };
  });
}

/** Bloque de la portada. */
export function PuertaBlock({ s }: { s: Settings }) {
  const uses = lines(s["puerta.uses"]);
  return (
    <section id="puerta" className="scroll-mt-16 overflow-hidden border-b border-paper-line py-24">
      <div className="container-x grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 font-mono text-xs text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {s["puerta.badge"]}
          </p>
          <h2 className="section-title mt-5"><Emph text={s["puerta.title"]} /></h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-700">{s["puerta.text"]}</p>
          {uses.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2">
              {uses.map((u) => (
                <li key={u} className="rounded-full border border-paper-line bg-white px-3 py-1 text-sm text-ink-700">{u}</li>
              ))}
            </ul>
          )}
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/puerta" className="btn-signal">{s["puerta.cta"]} →</Link>
            <Link href="/puerta#planes" className="btn-outline">Ver planes</Link>
          </div>
        </div>
        <div className="relative lg:col-span-6">
          <div className="pointer-events-none absolute inset-0 -z-10 m-auto h-80 w-80 rounded-full bg-brand-500/15 blur-3xl" />
          <PuertaPhone />
        </div>
      </div>
    </section>
  );
}
