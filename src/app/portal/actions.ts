"use server";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { notifyLead } from "@/lib/notify";
import { contractedItems } from "@/lib/client-items";
import { CLIENT_COOKIE, getClientId, startClientSession } from "@/lib/client-session";

const tries = new Map<string, { n: number; until: number }>();

export type PortalLogin = { error?: string; email?: string };

export async function clientLogin(_: PortalLogin, formData: FormData): Promise<PortalLogin> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const t = tries.get(ip);
  if (t && t.n >= 6 && t.until > Date.now()) return { error: "Demasiados intentos. Espera unos minutos." };
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const client = email ? await prisma.client.findFirst({ where: { email, portalHash: { not: "" } } }) : null;
  const ok = client ? await bcrypt.compare(password, client.portalHash) : false;
  if (!client || !ok) {
    const cur = t && t.until > Date.now() ? t : { n: 0, until: 0 };
    tries.set(ip, { n: cur.n + 1, until: Date.now() + 10 * 60 * 1000 });
    return { error: "Correo o contraseña incorrectos.", email };
  }
  tries.delete(ip);
  await startClientSession(client.id);
  redirect("/portal");
}

export async function clientLogout() {
  (await cookies()).delete({ name: CLIENT_COOKIE, path: "/portal" });
  redirect("/portal/ingresar");
}

async function me() {
  const cid = await getClientId();
  if (!cid) redirect("/portal/ingresar");
  return cid!;
}

const asks = new Map<number, { n: number; until: number }>();

/** El cliente no edita nada: pide el cambio y le llega al equipo como solicitud en el panel. */
export async function requestChange(formData: FormData) {
  const cid = await me();
  const c = await prisma.client.findUnique({ where: { id: cid } });
  if (!c) redirect("/portal/ingresar");
  const now = Date.now();
  const t = asks.get(cid);
  if (t && t.until > now && t.n >= 10) redirect("/portal?error=" + encodeURIComponent("Ya enviaste varias solicitudes hoy. Te respondemos pronto."));
  asks.set(cid, t && t.until > now ? { n: t.n + 1, until: t.until } : { n: 1, until: now + 24 * 3600_000 });

  const message = String(formData.get("message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 3000);
  if (message.length < 5) redirect("/portal?error=" + encodeURIComponent("Cuéntanos qué cambio necesitas.") + "#solicitar");
  const key = String(formData.get("item") ?? "");
  const item = (await contractedItems(cid)).find((i) => i.key === key)?.label || "Otro tema";
  const data = { name: c!.name, email: c!.email, phone: c!.phone, company: c!.company, service: `Portal · ${item}`.slice(0, 160), message };
  const lead = await prisma.lead.create({ data });
  try {
    await notifyLead(lead.id, data, `${c!.company || c!.name} pidió un cambio desde su portal`, false);
  } catch (e) {
    console.error("Aviso de solicitud del portal", e);
  }
  redirect("/portal?ok=" + encodeURIComponent("Recibimos tu solicitud. Te avisamos cuando esté lista.") + "#solicitudes");
}

export async function changeMyPortalPassword(formData: FormData) {
  const cid = await me();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const c = await prisma.client.findUnique({ where: { id: cid } });
  if (!c || !(await bcrypt.compare(current, c.portalHash))) redirect("/portal?error=" + encodeURIComponent("La contraseña actual no es correcta."));
  if (next.length < 8) redirect("/portal?error=" + encodeURIComponent("La nueva contraseña debe tener al menos 8 caracteres."));
  await prisma.client.update({ where: { id: cid }, data: { portalHash: await bcrypt.hash(next, 10) } });
  redirect("/portal?ok=" + encodeURIComponent("Contraseña actualizada."));
}
