import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import ContactForm from "@/components/ContactForm";
import { CastorlyBlock, FaqList, Hero, Plans, Process, ProductsGrid, ServicesGrid, Testimonials } from "@/components/Sections";

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
      <ServicesGrid services={services} s={s} />
      <CastorlyBlock s={s} product={castorly} />
      <ProductsGrid products={products} s={s} />
      <Process s={s} />
      <Plans plans={plans} s={s} />
      <Testimonials items={testimonials} s={s} />
      <FaqList items={faqs} s={s} />
      <section id="contacto" className="scroll-mt-20 py-24">
        <div className="container-x grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="eyebrow">Contacto</span>
            <h2 className="section-title mt-4">{s["cta.title"]}</h2>
            <p className="mt-4 text-lg text-slate-600">{s["cta.text"]}</p>
            <ul className="mt-8 space-y-3 text-sm text-slate-700">
              <li>✉️ <a className="hover:text-brand-700" href={`mailto:${s["contact.email"]}`}>{s["contact.email"]}</a></li>
              <li>📞 {s["contact.phone"]}</li>
              <li>📍 {s["contact.address"]}</li>
            </ul>
          </div>
          <div className="card lg:col-span-3 hover:translate-y-0">
            <ContactForm services={[...services.map((x) => x.title), ...products.map((p) => p.name)]} />
          </div>
        </div>
      </section>
    </>
  );
}
