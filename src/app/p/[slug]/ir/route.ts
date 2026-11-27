import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { parseButtons, resolveHref } from "@/lib/puerta";

/** Cuenta el toque y redirige al destino del botón. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = Number(req.nextUrl.searchParams.get("b"));
  const p = await prisma.linkPage.findFirst({ where: { slug, published: true } });
  const b = p ? parseButtons(p.buttons)[i] : undefined;
  const target = b ? resolveHref(b) : "";
  if (!p || !b || !target || target === "wifi") return NextResponse.redirect(new URL(`/p/${slug}`, req.url));
  await prisma.linkPage.update({ where: { id: p.id }, data: { clicks: { increment: 1 } } }).catch(() => {});
  return NextResponse.redirect(target.startsWith("/") ? new URL(target, req.url) : target, 302);
}
