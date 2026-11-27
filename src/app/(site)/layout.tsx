import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AldoChat from "@/components/AldoChat";
import { loadAldo } from "@/lib/aldo-server";
import { linkList } from "@/lib/utils";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { s, services, knowledge } = await loadAldo();
  return (
    <>
      <Header name={s["site.name"]} links={linkList(s["nav.items"])} cta={s["nav.cta"]} ctaUrl={s["nav.ctaUrl"]} login={s["nav.login"]} />
      <main>{children}</main>
      <Footer s={s} services={services} />
      <AldoChat k={knowledge} />
    </>
  );
}
