import Link from "next/link";
import Icon from "./Icon";
import { lines } from "@/lib/utils";
import type { Settings } from "@/lib/settings";
import type { Faq, Plan, Product, Service, Testimonial } from "@prisma/client";

export function SectionHeader({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-title mt-4">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-slate-600">{subtitle}</p>}
    </div>
  );
}

export function Hero({ s }: { s: Settings }) {
  const stats = [1, 2, 3].map((i) => [s[`hero.stat${i}Value`], s[`hero.stat${i}Label`]]).filter(([v]) => v);
  return (
    <section className="relative overflow-hidden bg-ink-900 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute -right-32 top-20 h-[420px] w-[420px] rounded-full bg-accent-500/25 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>
      <div className="container-x relative py-24 sm:py-32">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" /> {s["hero.badge"]}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            <span className="gradient-text">{s["hero.title"]}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">{s["hero.subtitle"]}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/contacto" className="btn-primary">{s["hero.ctaPrimary"]} →</Link>
            <Link href="/castorly" className="btn-ghost">{s["hero.ctaSecondary"]}</Link>
          </div>
        </div>
        {stats.length > 0 && (
          <dl className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {stats.map(([v, l]) => (
              <div key={l}>
                <dt className="text-3xl font-bold text-white">{v}</dt>
                <dd className="mt-1 text-sm text-slate-400">{l}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

export function ServicesGrid({ services, s }: { services: Service[]; s: Settings }) {
  return (
    <section id="servicios" className="scroll-mt-20 bg-slate-50 py-24">
      <div className="container-x">
        <SectionHeader eyebrow="Servicios" title={s["services.title"]} subtitle={s["services.subtitle"]} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((sv) => (
            <Link key={sv.id} href={`/servicios/${sv.slug}`} className="card group flex flex-col">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-md">
                <Icon name={sv.icon} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink-900">{sv.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{sv.shortDescription}</p>
              <span className="mt-5 text-sm font-semibold text-brand-600 group-hover:text-brand-700">Ver más →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CastorlyBlock({ s, product }: { s: Settings; product: Product | null }) {
  const feats = lines(product?.features).slice(0, 6);
  const image = s["castorly.imageUrl"] || product?.imageUrl;
  return (
    <section id="castorly" className="scroll-mt-20 py-24">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-ink-900 p-8 text-white sm:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent-500/30 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-400">
                {s["castorly.badge"]}
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{s["castorly.title"]}</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-200">{s["castorly.text"]}</p>
              {feats.length > 0 && (
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {feats.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-100">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" /> {f}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/castorly" className="btn bg-white text-brand-800 hover:bg-slate-100">{s["castorly.cta"]} →</Link>
                {s["castorly.url"] && (
                  <a href={s["castorly.url"]} target="_blank" rel="noopener noreferrer" className="btn-ghost">Abrir la app</a>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="Castorly" className="max-h-[420px] rounded-2xl shadow-2xl" />
              ) : (
                <PhoneMock />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMock() {
  return (
    <div className="relative h-[420px] w-[220px] rounded-[2.5rem] border-[10px] border-ink-900 bg-white shadow-2xl">
      <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-ink-900" />
      <div className="flex h-full flex-col gap-3 p-4 pt-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500" />
          <div className="text-sm font-bold text-ink-900">Castorly</div>
        </div>
        <div className="rounded-xl bg-brand-50 p-3">
          <div className="text-[10px] text-slate-500">Resumen de hoy</div>
          <div className="text-xl font-bold text-ink-900">87%</div>
          <div className="mt-2 h-1.5 rounded-full bg-brand-100"><div className="h-1.5 w-[87%] rounded-full bg-brand-500" /></div>
        </div>
        {["Tareas", "Clientes", "Reportes", "Equipo"].map((t, i) => (
          <div key={t} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
            <span className="text-xs font-medium text-slate-700">{t}</span>
            <span className="rounded-full bg-accent-500/15 px-2 py-0.5 text-[10px] font-semibold text-accent-600">{[12, 48, 5, 9][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductsGrid({ products, s }: { products: Product[]; s: Settings }) {
  if (!products.length) return null;
  return (
    <section id="productos" className="scroll-mt-20 bg-slate-50 py-24">
      <div className="container-x">
        <SectionHeader eyebrow="Productos" title={s["products.title"]} subtitle={s["products.subtitle"]} />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link key={p.id} href={`/productos/${p.slug}`} className="card group flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-ink-900">{p.name}</h3>
                {p.featured && <span className="rounded-full bg-accent-500/15 px-2.5 py-0.5 text-xs font-semibold text-accent-600">Destacado</span>}
              </div>
              <p className="mt-2 text-sm font-medium text-brand-700">{p.tagline}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {lines(p.features).slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" /> {f}
                  </li>
                ))}
              </ul>
              {p.price && <p className="mt-5 text-lg font-bold text-ink-900">{p.price}</p>}
              <span className="mt-4 text-sm font-semibold text-brand-600">Ver producto →</span>
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
        <SectionHeader eyebrow="Metodología" title={s["process.title"]} />
        <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((st, i) => (
            <li key={i} className="relative rounded-2xl border border-slate-200 p-6">
              <span className="text-4xl font-black text-brand-100">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-lg font-semibold text-ink-900">{st.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{st.text}</p>
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
    <section id="planes" className="scroll-mt-20 bg-ink-900 py-24 text-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-400">Precios</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{s["plans.title"]}</h2>
          <p className="mt-4 text-lg text-slate-300">{s["plans.subtitle"]}</p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-2xl p-8 ${p.highlighted ? "bg-white text-slate-800 shadow-2xl ring-2 ring-accent-400 lg:-translate-y-3" : "border border-white/10 bg-white/5"}`}
            >
              {p.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-ink-900">Recomendado</span>
              )}
              <h3 className={`text-lg font-semibold ${p.highlighted ? "text-ink-900" : "text-white"}`}>{p.name}</h3>
              <p className={`mt-1 text-sm ${p.highlighted ? "text-slate-500" : "text-slate-400"}`}>{p.description}</p>
              <p className="mt-6">
                <span className={`text-4xl font-extrabold ${p.highlighted ? "text-ink-900" : "text-white"}`}>{p.price}</span>
                {p.period && <span className={`ml-1 text-sm ${p.highlighted ? "text-slate-500" : "text-slate-400"}`}>{p.period}</span>}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {lines(p.features).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link href={`/contacto?servicio=${encodeURIComponent("Plan " + p.name)}`} className={`mt-8 ${p.highlighted ? "btn-primary" : "btn-ghost"}`}>
                Elegir plan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ items, s }: { items: Testimonial[]; s: Settings }) {
  if (!items.length) return null;
  return (
    <section className="py-24">
      <div className="container-x">
        <SectionHeader eyebrow="Clientes" title={s["testimonials.title"]} />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.id} className="card">
              <blockquote className="text-slate-700">“{t.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">{t.name.charAt(0)}</span>
                <span>
                  <span className="block text-sm font-semibold text-ink-900">{t.name}</span>
                  <span className="block text-xs text-slate-500">{[t.role, t.company].filter(Boolean).join(" · ")}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqList({ items, s }: { items: Faq[]; s: Settings }) {
  if (!items.length) return null;
  return (
    <section id="faq" className="scroll-mt-20 bg-slate-50 py-24">
      <div className="container-x max-w-3xl">
        <SectionHeader eyebrow="FAQ" title={s["faq.title"]} />
        <div className="mt-12 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {items.map((f) => (
            <details key={f.id} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink-900">
                {f.question}
                <span className="text-brand-600 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 whitespace-pre-line text-slate-600">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
