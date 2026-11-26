import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: { default: s["seo.title"], template: `%s | ${s["site.name"]}` },
    description: s["seo.description"],
    openGraph: { title: s["seo.title"], description: s["seo.description"], type: "website", locale: "es_CO" },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
