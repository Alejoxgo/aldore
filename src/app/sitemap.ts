import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.SITE_URL || "https://aldore.co").replace(/\/$/, "");
  const [services, products] = await Promise.all([
    prisma.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.product.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/contacto`, changeFrequency: "monthly", priority: 0.8 },
    ...services.map((s) => ({ url: `${base}/servicios/${s.slug}`, lastModified: s.updatedAt, priority: 0.7 })),
    ...products.map((p) => ({ url: `${base}/productos/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
  ];
}
