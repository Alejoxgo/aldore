"use server";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
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

/** El cliente cambia los textos, botones y wifi de su propia Puerta. */
export async function updateMyPuerta(id: number, formData: FormData) {
  const cid = await me();
  const page = await prisma.linkPage.findFirst({ where: { id, clientId: cid } });
  if (!page) redirect("/portal?error=" + encodeURIComponent("Esa Puerta no es tuya."));
  const s = (k: string, max: number) => String(formData.get(k) ?? "").replace(/\r\n/g, "\n").trim().slice(0, max);
  await prisma.linkPage.update({
    where: { id },
    data: { name: s("name", 80) || page!.name, subtitle: s("subtitle", 120), buttons: s("buttons", 4000), wifiName: s("wifiName", 60), wifiPass: s("wifiPass", 60) },
  });
  revalidatePath(`/p/${page!.slug}`);
  redirect("/portal?ok=" + encodeURIComponent("Tu Puerta quedó actualizada."));
}

/** Abrir o cerrar su fila de turnos. */
export async function toggleMyQueue(id: number) {
  const cid = await me();
  const q = await prisma.queue.findFirst({ where: { id, clientId: cid } });
  if (q) await prisma.queue.update({ where: { id }, data: { open: !q.open } });
  redirect("/portal?ok=" + encodeURIComponent(q?.open ? "Turnos cerrados." : "Turnos abiertos."));
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
