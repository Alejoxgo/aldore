import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AldoChat from "@/components/AldoChat";
import { loadAldo } from "@/lib/aldo-server";
import { linkList } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { SeasonWear } from "@/components/Aldo";
import SeasonLayer from "@/components/SeasonLayer";
import { SEASONS, activeSeason } from "@/lib/season";
import { getRawSettings } from "@/lib/settings";
import { getT } from "@/lib/i18n";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ s, services, knowledge }, session] = await Promise.all([loadAldo(), getSession().catch(() => null)]);
  // Temática de temporada (Navidad, Halloween…): se decide con los ajustes en español y se traduce el mensaje.
  const raw = await getRawSettings();
  const seasonId = activeSeason(raw["theme.mode"]);
  const season = seasonId ? SEASONS[seasonId] : null;
  const { t } = await getT();
  const banner = season ? s["theme.message"] || t(season.banner) : "";
  const effects = !/^(no|0|false)$/i.test((raw["theme.effects"] || "").trim());
  return (
    <SeasonWear wear={season?.wear ?? []}>
    <div className={`site-grain ${seasonId ? `season-${seasonId}` : ""}`}>
      {season && banner && (
        <div
          className="season-banner px-4 py-1.5 text-center text-[13px] font-medium text-white"
          style={{ ["--s1" as string]: season.colors[0], ["--s2" as string]: season.colors[1], ["--s3" as string]: season.colors[2] }}
        >
          {banner}
        </div>
      )}
      {season && effects && <SeasonLayer particle={season.particle} colors={season.colors} />}
      <Header name={s["site.name"]} links={linkList(s["nav.items"])} cta={s["nav.cta"]} ctaUrl={s["nav.ctaUrl"]} login={s["nav.login"]} user={session?.name || null} lang={knowledge.lang} />
      <main>{children}</main>
      <Footer s={s} services={services} />
      <AldoChat k={knowledge} />
    </div>
    </SeasonWear>
  );
}
