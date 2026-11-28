import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AldoChat from "@/components/AldoChat";
import { loadAldo } from "@/lib/aldo-server";
import { linkList } from "@/lib/utils";
import { getSession } from "@/lib/auth";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ s, services, knowledge }, session] = await Promise.all([loadAldo(), getSession().catch(() => null)]);
  return (
    <div className="site-grain">
      <Header name={s["site.name"]} links={linkList(s["nav.items"])} cta={s["nav.cta"]} ctaUrl={s["nav.ctaUrl"]} login={s["nav.login"]} user={session?.name || null} lang={knowledge.lang} />
      <main>{children}</main>
      <Footer s={s} services={services} />
      <AldoChat k={knowledge} />
    </div>
  );
}
