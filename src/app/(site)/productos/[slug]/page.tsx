import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Icon from "@/components/Icon";
import ContactForm from "@/components/ContactForm";
import { lines, paragraphs } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  return prisma.product.findFirst({ where: { slug, published: true } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await load((await params).slug);
  return p ? { title: p.name, description: p.tagline } : {};
}

export default async function ProductPage({ params }: Props) {
  const p = await load((await params).slug);
  if (!p) notFound();
  const feats = lines(p.features);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink-900 py-20 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent-500/25 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Link href="/#productos" className="text-sm text-slate-300 hover:text-white">← Productos</Link>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">{p.name}</h1>
            <p className="mt-4 text-xl text-slate-200">{p.tagline}</p>
            {p.price && (
              <p className="mt-6">
                <span className="text-3xl font-bold">{p.price}</span>
                {p.priceNote && <span className="ml-2 text-sm text-slate-300">{p.priceNote}</span>}
              </p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {p.ctaUrl ? (
                <a href={p.ctaUrl} target="_blank" rel="noopener noreferrer" className="btn bg-white text-brand-800 hover:bg-slate-100">{p.ctaLabel} →</a>
              ) : (
                <a href="#solicitar" className="btn bg-white text-brand-800 hover:bg-slate-100">{p.ctaLabel} →</a>
              )}
            </div>
          </div>
          {p.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.imageUrl} alt={p.name} className="mx-auto max-h-[440px] rounded-2xl shadow-2xl" />
          )}
        </div>
      </section>
      <section className="py-20">
        <div className="container-x grid gap-12 lg:grid-cols-5">
          <div className="space-y-5 text-lg leading-relaxed text-slate-700 lg:col-span-3">
            {paragraphs(p.description).map((t, i) => <p key={i}>{t}</p>)}
          </div>
          {feats.length > 0 && (
            <div className="grid gap-3 lg:col-span-2">
              {feats.map((f) => (
                <div key={f} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-accent-600">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-slate-700">{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <section id="solicitar" className="scroll-mt-20 bg-slate-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="section-title text-center">Solicita una demo de {p.name}</h2>
          <div className="card mt-10 hover:translate-y-0">
            <ContactForm services={[p.name]} defaultService={p.name} />
          </div>
        </div>
      </section>
    </>
  );
}
