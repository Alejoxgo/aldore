import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AldoChat from "@/components/AldoChat";
import { buildAldo } from "@/lib/aldo";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/db";
import { linkList } from "@/lib/utils";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const pub = { where: { published: true }, orderBy: { order: "asc" as const } };
  const [s, services, products, plans, faqs] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ ...pub, select: { slug: true, title: true, shortDescription: true, features: true } }),
    prisma.product.findMany({ ...pub, select: { slug: true, name: true, tagline: true, features: true, price: true } }),
    prisma.plan.findMany({ ...pub, select: { name: true, price: true, period: true } }),
    prisma.faq.findMany({ ...pub, select: { question: true, answer: true } }),
  ]);
  return (
    <>
      <Header name={s["site.name"]} links={linkList(s["nav.items"])} cta={s["nav.cta"]} ctaUrl={s["nav.ctaUrl"]} login={s["nav.login"]} />
      <main>{children}</main>
      <Footer s={s} services={services} />
      <AldoChat k={buildAldo(s, services, products, plans, faqs)} />
    </>
  );
}
