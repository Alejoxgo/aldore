import type { Metadata } from "next";
import "./fonts";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import { getT } from "@/lib/i18n";
import { UI_STRINGS } from "@/lib/ui-strings";
import { UiProvider } from "@/components/TC";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(process.env.SITE_URL || "https://aldore.co"),
    title: { default: s["seo.title"], template: `%s | ${s["site.name"]}` },
    description: s["seo.description"],
    openGraph: { title: s["seo.title"], description: s["seo.description"], type: "website", locale: (await getT()).lang === "en" ? "en_US" : "es_CO" },
    alternates: { canonical: "/", languages: { es: "/", en: "/en" } },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, t } = await getT();
  // En inglés, el diccionario de textos fijos de la interfaz viaja a los componentes (ver TC.tsx).
  const dict: Record<string, string> = {};
  if (lang === "en") for (const k of UI_STRINGS) { const v = t(k); if (v !== k) dict[k] = v; }
  return (
    <html lang={lang}>
      <body>
        <UiProvider dict={dict}>{children}</UiProvider>
      </body>
    </html>
  );
}
