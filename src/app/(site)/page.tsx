import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { IntegrationsDiagram, StackMarquee } from "@/components/TechSections";
import Aldo from "@/components/Aldo";
import ContactForm from "@/components/ContactForm";
import { PuertaBlock } from "@/components/PuertaSections";
import { CastorlyBlock, Emph, FaqList, Hero, Plans, Process, ProductsList, ServicesList, Testimonials } from "@/components/Sections";

export default async function HomePage() {
  const pub = { where: { published: true }, orderBy: { order: "asc" as const } };
  const [s, services, products, plans, testimonials, faqs] = await Promise.all([
    getSettings(),
    prisma.service.findMany(pub),
    prisma.product.findMany(pub),
    prisma.plan.findMany(pub),
    prisma.testimonial.findMany(pub),
    prisma.faq.findMany(pub),
  ]);
  const castorly = products.find((p) => p.slug === "castorly") ?? null;

  return (
    <>
      <Hero s={s} />
      <StackMarquee s={s} />
      <ServicesList services={services} s={s} />
      <CastorlyBlock s={s} product={castorly} />
      <PuertaBlock s={s} />
      <ProductsList products={products} s={s} />
      <IntegrationsDiagram s={s} />
      <Process s={s} />
      <Plans plans={plans} s={s} />
      <Testimonials items={testimonials} s={s} />
      <FaqList items={faqs} s={s} />
      <section id="contacto" className="scroll-mt-16 border-t border-paper-line bg-white/50 py-24">
        <div className="container-x grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-end justify-between gap-4">
              <p className="eyebrow">Contacto</p>
              <Aldo pose="wave" className="-mb-2 h-24 w-24 shrink-0" />
            </div>
            <h2 className="section-title mt-2"><Emph text={s["cta.title"]} /></h2>
            <p className="mt-5 text-lg text-ink-700">{s["cta.text"]}</p>
            <dl className="mt-10 space-y-5 border-t border-paper-line pt-6 text-[15px]">
              <div><dt className="eyebrow">Correo</dt><dd className="mt-1"><a className="link-u" href={`mailto:${s["contact.email"]}`}>{s["contact.email"]}</a></dd></div>
              <div><dt className="eyebrow">Teléfono</dt><dd className="mt-1">{s["contact.phone"]}</dd></div>
              <div><dt className="eyebrow">Dónde</dt><dd className="mt-1">{s["contact.address"]}</dd></div>
            </dl>
          </div>
          <div className="lg:col-span-7">
            <ContactForm services={[...services.map((x) => x.title), ...products.map((p) => p.name), "Puerta (QR / NFC)"]} />
          </div>
        </div>
      </section>
    </>
  );
}
