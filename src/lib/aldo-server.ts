import "server-only";
import { prisma } from "./db";
import { getSettings } from "./settings";
import { buildAldo } from "./aldo";

/** Carga lo que Aldo sabe: textos del sitio, servicios, productos, planes y preguntas frecuentes. */
export async function loadAldo() {
  const pub = { where: { published: true }, orderBy: { order: "asc" as const } };
  const [s, services, products, plans, faqs] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ ...pub, select: { slug: true, title: true, shortDescription: true, features: true } }),
    prisma.product.findMany({ ...pub, select: { slug: true, name: true, tagline: true, features: true, price: true } }),
    prisma.plan.findMany({ ...pub, select: { name: true, price: true, period: true } }),
    prisma.faq.findMany({ ...pub, select: { question: true, answer: true } }),
  ]);
  return { s, services, knowledge: { ...buildAldo(s, services, products, plans, faqs), ai: Boolean(process.env.GROQ_API_KEY) } };
}
