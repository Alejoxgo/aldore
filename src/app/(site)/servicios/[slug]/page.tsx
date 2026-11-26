import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Icon from "@/components/Icon";
import ContactForm from "@/components/ContactForm";
import { lines, paragraphs } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  return prisma.service.findFirst({ where: { slug, published: true } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sv = await load((await params).slug);
  return sv ? { title: sv.title, description: sv.shortDescription } : {};
}

export default async function ServicePage({ params }: Props) {
  const sv = await load((await params).slug);
  if (!sv) notFound();
  const others = await prisma.service.findMany({
    where: { published: true, NOT: { id: sv.id } },
    orderBy: { order: "asc" },
    take: 3,
  });
  const feats = lines(sv.features);

  return (
    <>
      <section className="bg-ink-900 py-20 text-white">
        <div className="container-x">
          <Link href="/#servicios" className="text-sm text-slate-400 hover:text-white">← Todos los servicios</Link>
          <div className="mt-6 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500">
              <Icon name={sv.icon} className="h-7 w-7" />
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{sv.title}</h1>
          </div>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">{sv.shortDescription}</p>
        </div>
      </section>
      <section className="py-20">
        <div className="container-x grid gap-12 lg:grid-cols-3">
          <div className="space-y-5 text-lg leading-relaxed text-slate-700 lg:col-span-2">
            {paragraphs(sv.description).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {feats.length > 0 && (
            <aside className="card h-fit hover:translate-y-0">
              <h2 className="font-semibold text-ink-900">Qué incluye</h2>
              <ul className="mt-4 space-y-3">
                {feats.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" /> {f}
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>
      <section className="bg-slate-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="section-title text-center">Cotiza tu proyecto de {sv.title.toLowerCase()}</h2>
          <div className="card mt-10 hover:translate-y-0">
            <ContactForm services={[sv.title]} defaultService={sv.title} />
          </div>
        </div>
      </section>
      {others.length > 0 && (
        <section className="py-20">
          <div className="container-x">
            <h2 className="text-2xl font-bold text-ink-900">Otros servicios</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {others.map((o) => (
                <Link key={o.id} href={`/servicios/${o.slug}`} className="card">
                  <Icon name={o.icon} className="h-6 w-6 text-brand-600" />
                  <h3 className="mt-3 font-semibold text-ink-900">{o.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{o.shortDescription}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
