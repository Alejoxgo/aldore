import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/db";
import { linkList } from "@/lib/utils";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, services] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ where: { published: true }, orderBy: { order: "asc" }, select: { slug: true, title: true } }),
  ]);
  return (
    <>
      <Header name={s["site.name"]} links={linkList(s["nav.items"])} cta={s["nav.cta"]} ctaUrl={s["nav.ctaUrl"]} login={s["nav.login"]} />
      <main>{children}</main>
      <Footer s={s} services={services} />
      <WhatsAppButton number={s["contact.whatsapp"]} bubble={s["aldo.bubble"]} />
    </>
  );
}
