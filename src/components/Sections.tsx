import Link from "next/link";
import { Fragment } from "react";
import { lines } from "@/lib/utils";
import Terminal from "./Terminal";
import Aldo from "./Aldo";
import type { Settings } from "@/lib/settings";
import type { Faq, Plan, Product, Service, Testimonial } from "@prisma/client";

/** Convierte *palabra* en énfasis (cursiva en color de acento). */
export function Emph({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <em key={i} className="font-serif font-normal italic tracking-normal text-brand-500">{p}</em>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

function Label({ n, children, light = false }: { n: string; children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${light ? "!text-paper/50" : ""}`}>
      <span className="text-brand-500">{n}</span>
      <span className={`h-px w-8 ${light ? "bg-paper/20" : "bg-ink-900/20"}`} />
      {children}
    </p>
  );
}

const Arrow = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export function Hero({ s }: { s: Settings }) {
  const stats = [1, 2, 3].map((i) => [s[`hero.stat${i}Value`], s[`hero.stat${i}Label`]]).filter(([v]) => v);
  const script = lines(s["hero.terminal"]).map((l) =>
    l.startsWith("$")
      ? { kind: "cmd" as const, text: l.replace(/^\$\s*/, "") }
      : l.startsWith("✓")
        ? { kind: "ok" as const, text: l.replace(/^✓\s*/, "") }
        : { kind: "info" as const, text: l },
  );
  return (
    <section className="relative overflow-hidden bg-ink-900 text-paper">
      <div className="tech-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-brand-500/10 blur-[120px]" />
      <div className="container-x relative grid grid-cols-1 items-center gap-14 pb-20 pt-16 sm:pt-24 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-paper/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {s["hero.badge"]}
          </p>
          <h1 className="mt-7 font-display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[3.9rem]">
            <Emph text={s["hero.title"]} />
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">{s["hero.subtitle"]}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/contacto" className="btn-signal">
              {s["hero.ctaPrimary"]} <Arrow className="h-4 w-4" />
            </Link>
            <Link href="/castorly" className="btn-ghost text-paper">{s["hero.ctaSecondary"]}</Link>
          </div>
          {stats.length > 0 && (
            <dl className="mt-14 grid grid-cols-3 items-start gap-6 border-t border-white/10 pt-8">
              {stats.map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl text-paper sm:text-4xl">{v}</dt>
                  <dd className="mt-2 font-mono text-xs leading-snug text-paper/50">{l}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {script.length > 0 && (
          <div className="relative min-w-0 pt-20 lg:col-span-6">
            <div className="pointer-events-none absolute right-6 top-[-14px] z-10 sm:right-10">
              <Aldo pose="base" onDark className="h-[104px] w-[104px]" title="Aldo, el búho de Aldore, sobre la terminal" />
            </div>
            <Terminal script={script} />
          </div>
        )}
      </div>
    </section>
  );
}

export function ServicesList({ services, s }: { services: Service[]; s: Settings }) {
  return (
    <section id="servicios" className="scroll-mt-16 py-24">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Label n="01">Servicios</Label>
            <h2 className="section-title mt-5"><Emph text={s["services.title"]} /></h2>
          </div>
          <p className="self-end text-lg text-ink-700 lg:col-span-5 lg:col-start-8">{s["services.subtitle"]}</p>
        </div>
        <ul className="mt-14 border-t border-ink-900">
          {services.map((sv, i) => (
            <li key={sv.id} className="border-b border-paper-line">
              <Link
                href={`/servicios/${sv.slug}`}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-2 py-7 transition-colors hover:bg-paper-2 sm:grid-cols-[4rem_1fr_1.2fr_auto] sm:px-3"
              >
                <span className="font-mono text-sm text-ink-400">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-2xl text-ink-900 sm:text-3xl">{sv.title}</span>
                <span className="col-start-2 text-ink-500 sm:col-start-3 sm:row-start-1">
                  {sv.shortDescription}
                  <span className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
                    {lines(sv.features).slice(0, 3).map((f) => (
                      <span key={f} className="rounded border border-paper-line bg-paper px-2 py-0.5 font-mono text-[11px] text-ink-500">{f}</span>
                    ))}
                  </span>
                </span>
                <span className="col-start-3 row-start-1 text-ink-400 transition group-hover:translate-x-1 group-hover:text-brand-500 sm:col-start-4">
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CastorlyBlock({ s, product }: { s: Settings; product: Product | null }) {
  const feats = lines(product?.features).slice(0, 6);
  const image = s["castorly.imageUrl"] || product?.imageUrl;
  return (
    <section id="castorly" className="scroll-mt-16 bg-ink-900 py-24 text-paper">
      <div className="container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Label n="02" light>{s["castorly.badge"]}</Label>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl">
            <Emph text={s["castorly.title"]} />
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-paper/70">{s["castorly.text"]}</p>
          {feats.length > 0 && (
            <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {feats.map((f) => (
                <li key={f} className="flex gap-3 py-3 text-[15px] text-paper/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-500" /> {f}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/castorly" className="btn-signal">{s["castorly.cta"]} <Arrow className="h-4 w-4" /></Link>
            {s["castorly.url"] && (
              <a href={s["castorly.url"]} target="_blank" rel="noopener noreferrer" className="btn-ghost text-paper">
                {s["castorly.urlLabel"] || "Abrir la app"} ↗
              </a>
            )}
          </div>
        </div>
        <div className="lg:col-span-7">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="Castorly" className="w-full rounded-xl border border-white/10" />
          ) : (
            <DeskMock />
          )}
        </div>
      </div>
    </section>
  );
}

/** Maqueta sencilla de la pantalla de tickets (se reemplaza subiendo una captura en el panel). */
function DeskMock() {
  const rows = [
    ["#4821", "No puedo conectarme a la VPN", "En curso", true],
    ["#4820", "Restablecer contraseña de correo", "Resuelto", false],
    ["#4818", "Impresora del piso 3 sin conexión", "Nuevo", false],
    ["#4815", "Acceso a carpeta compartida", "Resuelto", false],
  ] as const;
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1d1915] text-sm shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="font-semibold text-paper">Castorly</span>
        <span className="font-mono text-xs text-paper/40">Service Desk · Turno mañana</span>
      </div>
      <div className="grid sm:grid-cols-[1fr_14rem]">
        <ul className="divide-y divide-white/5">
          {rows.map(([id, t, st, active]) => (
            <li key={id} className={`flex items-center gap-3 px-4 py-3.5 ${active ? "bg-white/[0.04]" : ""}`}>
              <span className="font-mono text-xs text-paper/40">{id}</span>
              <span className="flex-1 truncate text-paper/85">{t}</span>
              <span className={`rounded px-2 py-0.5 text-[11px] ${st === "En curso" ? "bg-brand-500/20 text-brand-300" : st === "Nuevo" ? "bg-white/10 text-paper/70" : "text-paper/40"}`}>{st}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-white/10 p-4 sm:border-l sm:border-t-0">
          <p className="font-mono text-[11px] uppercase tracking-wider text-brand-400">Cástor</p>
          <p className="mt-2 leading-relaxed text-paper/80">
            Encontré el artículo «Reinstalar el cliente VPN». ¿Quieres que guíe la llamada paso a paso?
          </p>
          <div className="mt-4 flex gap-2">
            <span className="rounded bg-brand-500 px-2.5 py-1 text-xs font-semibold text-white">Sí, guíame</span>
            <span className="rounded border border-white/15 px-2.5 py-1 text-xs text-paper/70">Ver artículo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductsList({ products, s }: { products: Product[]; s: Settings }) {
  const others = products.filter((p) => p.slug !== "castorly");
  if (!others.length) return null;
  return (
    <section id="productos" className="scroll-mt-16 border-b border-paper-line py-24">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Label n="03">Productos</Label>
          <h2 className="section-title mt-5"><Emph text={s["products.title"]} /></h2>
          <p className="mt-5 text-ink-700">{s["products.subtitle"]}</p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-paper-line bg-paper-line sm:grid-cols-2 lg:col-span-8">
          {others.map((p) => (
            <Link key={p.id} href={`/productos/${p.slug}`} className="group flex flex-col bg-paper p-7 transition-colors hover:bg-white">
              <h3 className="font-display text-2xl text-ink-900">{p.name}</h3>
              <p className="mt-2 flex-1 text-ink-500">{p.tagline}</p>
              {p.price && <p className="mt-6 text-sm font-semibold text-ink-900">{p.price}</p>}
              <span className="mt-4 inline-flex items-center gap-2 text-sm text-ink-700 group-hover:text-brand-600">
                Ver detalles <Arrow className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process({ s }: { s: Settings }) {
  const steps = lines(s["process.steps"]).map((l) => {
    const [t, ...d] = l.split("|");
    return { title: t.trim(), text: d.join("|").trim() };
  });
  if (!steps.length) return null;
  return (
    <section className="py-24">
      <div className="container-x">
        <Label n="04">Cómo trabajamos</Label>
        <h2 className="section-title mt-5 max-w-2xl"><Emph text={s["process.title"]} /></h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((st, i) => (
            <li key={i} className="border-t border-ink-900 pt-5">
              <span className="font-mono text-xs text-brand-500">Paso {String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-2xl text-ink-900">{st.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-500">{st.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Plans({ plans, s }: { plans: Plan[]; s: Settings }) {
  if (!plans.length) return null;
  return (
    <section id="planes" className="scroll-mt-16 bg-paper-2 py-24">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Label n="05">Planes</Label>
            <h2 className="section-title mt-5"><Emph text={s["plans.title"]} /></h2>
          </div>
          <p className="self-end text-ink-700 lg:col-span-5 lg:col-start-8">{s["plans.subtitle"]}</p>
        </div>
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {plans.map((p) => {
            const hl = p.highlighted;
            return (
              <div key={p.id} className={`flex flex-col rounded-xl p-8 ${hl ? "bg-ink-900 text-paper" : "border border-paper-line bg-paper"}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl">{p.name}</h3>
                  {hl && <span className="font-mono text-[11px] uppercase tracking-wider text-brand-400">El más elegido</span>}
                </div>
                <p className={`mt-1 text-sm ${hl ? "text-paper/60" : "text-ink-500"}`}>{p.description}</p>
                <p className="mt-8 font-display text-5xl tracking-tight">{p.price}</p>
                {p.period && <p className={`mt-1 text-sm ${hl ? "text-paper/50" : "text-ink-400"}`}>{p.period}</p>}
                <ul className={`mt-8 flex-1 divide-y border-t text-[15px] ${hl ? "divide-white/10 border-white/10" : "divide-paper-line border-paper-line"}`}>
                  {lines(p.features).map((f) => (
                    <li key={f} className="py-2.5">{f}</li>
                  ))}
                </ul>
                <Link
                  href={`/contacto?servicio=${encodeURIComponent("Plan " + p.name)}`}
                  className={`mt-8 ${hl ? "btn-signal" : "btn-outline"}`}
                >
                  Elegir {p.name}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ items, s }: { items: Testimonial[]; s: Settings }) {
  if (!items.length) return null;
  const [first, ...rest] = items;
  const who = (t: Testimonial) => [t.role, t.company].filter(Boolean).join(", ");
  return (
    <section className="py-24">
      <div className="container-x">
        <Label n="06">{s["testimonials.title"]}</Label>
        <figure className="mt-10 max-w-4xl">
          <blockquote className="font-display text-3xl leading-snug text-ink-900 sm:text-4xl">“{first.quote}”</blockquote>
          <figcaption className="mt-6 text-ink-500">
            <span className="font-semibold text-ink-900">{first.name}</span> · {who(first)}
          </figcaption>
        </figure>
        {rest.length > 0 && (
          <div className="mt-16 grid gap-10 border-t border-paper-line pt-10 md:grid-cols-2">
            {rest.map((t) => (
              <figure key={t.id}>
                <blockquote className="text-lg leading-relaxed text-ink-700">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-ink-500">
                  <span className="font-semibold text-ink-900">{t.name}</span> · {who(t)}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function FaqList({ items, s }: { items: Faq[]; s: Settings }) {
  if (!items.length) return null;
  return (
    <section id="faq" className="scroll-mt-16 border-t border-paper-line py-24">
      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Label n="07">Preguntas</Label>
          <h2 className="section-title mt-5"><Emph text={s["faq.title"]} /></h2>
        </div>
        <div className="border-t border-ink-900 lg:col-span-8">
          {items.map((f) => (
            <details key={f.id} className="group border-b border-paper-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium text-ink-900">
                {f.question}
                <span className="font-mono text-xl text-ink-400 transition group-open:rotate-45 group-open:text-brand-500">+</span>
              </summary>
              <p className="-mt-2 max-w-2xl whitespace-pre-line pb-6 leading-relaxed text-ink-500">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
