import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import ContactForm from "@/components/ContactForm";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = { title: "Contacto" };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ servicio?: string }> }) {
  const { servicio = "" } = await searchParams;
  const [s, services, products] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ where: { published: true }, orderBy: { order: "asc" }, select: { title: true } }),
    prisma.product.findMany({ where: { published: true }, orderBy: { order: "asc" }, select: { name: true } }),
  ]);
  const options = [...services.map((x) => x.title), ...products.map((p) => p.name)];
  if (servicio && !options.includes(servicio)) options.push(servicio);
  const wa = whatsappLink(s["contact.whatsapp"], "Hola, quiero cotizar un proyecto.");

  return (
    <>
      <section className="bg-ink-900 py-20 text-white">
        <div className="container-x">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{s["cta.title"]}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">{s["cta.text"]}</p>
        </div>
      </section>
      <section className="py-20">
        <div className="container-x grid gap-12 lg:grid-cols-3">
          <div className="card hover:translate-y-0 lg:col-span-2">
            <ContactForm services={options} defaultService={servicio} />
          </div>
          <aside className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Correo</h2>
              <a href={`mailto:${s["contact.email"]}`} className="mt-1 block text-lg font-medium text-ink-900 hover:text-brand-700">{s["contact.email"]}</a>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Teléfono</h2>
              <p className="mt-1 text-lg font-medium text-ink-900">{s["contact.phone"]}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Ubicación</h2>
              <p className="mt-1 text-ink-900">{s["contact.address"]}</p>
              <p className="text-sm text-slate-500">{s["contact.hours"]}</p>
            </div>
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn w-full bg-[#25D366] text-white hover:brightness-95">Escríbenos por WhatsApp</a>}
          </aside>
        </div>
      </section>
    </>
  );
}
