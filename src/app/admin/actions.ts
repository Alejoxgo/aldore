"use server";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/session";
import { getResource } from "@/lib/resources";
import { SETTING_KEYS } from "@/lib/settings";
import { slugify } from "@/lib/utils";
import { LEAD_STATUSES } from "@/lib/leads";

/* ---------------- Autenticación ---------------- */

const attempts = new Map<string, { count: number; until: number }>();

export type LoginState = { error?: string; email?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const a = attempts.get(ip);
  if (a && a.count >= 5 && a.until > Date.now()) {
    return { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await prisma.user.findUnique({ where: { email } });
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !ok) {
    const cur = a && a.until > Date.now() ? a : { count: 0, until: 0 };
    attempts.set(ip, { count: cur.count + 1, until: Date.now() + 10 * 60 * 1000 });
    return { error: "Correo o contraseña incorrectos.", email };
  }
  attempts.delete(ip);

  const token = await signSession({ uid: user.id, email: user.email, name: user.name });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.INSECURE_COOKIES !== "true",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ---------------- CRUD genérico ---------------- */

function refreshSite() {
  revalidatePath("/", "layout");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function delegate(model: string): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any)[model];
}

export async function saveResource(resourceKey: string, id: number | null, formData: FormData) {
  await requireAdmin();
  const res = getResource(resourceKey);
  if (!res) throw new Error("Recurso desconocido");

  const data: Record<string, unknown> = {};
  for (const f of res.fields) {
    const raw = formData.get(f.name);
    if (f.type === "checkbox") data[f.name] = raw === "on";
    else if (f.type === "number") data[f.name] = Number.parseInt(String(raw ?? "0"), 10) || 0;
    else data[f.name] = String(raw ?? "").replace(/\r\n/g, "\n").trim();
  }
  const slugField = res.fields.find((f) => f.type === "slug");
  if (slugField) {
    data[slugField.name] = slugify(String(data[slugField.name] || data[res.titleField] || "")) || `item-${Date.now()}`;
  }

  const missing = res.fields.filter((f) => f.required && !data[f.name]);
  if (missing.length) {
    redirect(`/admin/${res.key}/${id ?? "nuevo"}?error=${encodeURIComponent("Completa: " + missing.map((m) => m.label).join(", "))}`);
  }

  try {
    if (id) await delegate(res.model).update({ where: { id }, data });
    else await delegate(res.model).create({ data });
  } catch (e: unknown) {
    const msg = (e as { code?: string }).code === "P2002" ? "Ya existe un registro con ese slug." : "No se pudo guardar.";
    redirect(`/admin/${res.key}/${id ?? "nuevo"}?error=${encodeURIComponent(msg)}`);
  }
  refreshSite();
  redirect(`/admin/${res.key}?ok=${encodeURIComponent("Guardado correctamente")}`);
}

export async function deleteResource(resourceKey: string, id: number) {
  await requireAdmin();
  const res = getResource(resourceKey);
  if (!res) throw new Error("Recurso desconocido");
  await delegate(res.model).delete({ where: { id } });
  refreshSite();
  redirect(`/admin/${res.key}?ok=${encodeURIComponent("Eliminado")}`);
}

export async function toggleResource(resourceKey: string, id: number, published: boolean) {
  await requireAdmin();
  const res = getResource(resourceKey);
  if (!res) throw new Error("Recurso desconocido");
  await delegate(res.model).update({ where: { id }, data: { published } });
  refreshSite();
  revalidatePath(`/admin/${res.key}`);
}

/* ---------------- Textos del sitio ---------------- */

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const ops = [];
  for (const [key, value] of formData.entries()) {
    if (!SETTING_KEYS.has(key)) continue;
    const v = String(value).replace(/\r\n/g, "\n").trim();
    ops.push(prisma.setting.upsert({ where: { key }, create: { key, value: v }, update: { value: v } }));
  }
  await prisma.$transaction(ops);
  refreshSite();
  const group = String(formData.get("_group") ?? "");
  redirect(`/admin/contenido?ok=${encodeURIComponent("Textos actualizados")}${group ? `#${group}` : ""}`);
}

/* ---------------- Leads ---------------- */

export async function updateLead(id: number, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") ?? "nuevo");
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  await prisma.lead.update({
    where: { id },
    data: { status: (LEAD_STATUSES as readonly string[]).includes(status) ? status : "nuevo", notes },
  });
  redirect(`/admin/leads/${id}?ok=${encodeURIComponent("Lead actualizado")}`);
}

export async function deleteLead(id: number) {
  await requireAdmin();
  await prisma.lead.delete({ where: { id } });
  redirect(`/admin/leads?ok=${encodeURIComponent("Lead eliminado")}`);
}

/* ---------------- Usuarios ---------------- */

export async function createUser(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !name || password.length < 8) {
    redirect(`/admin/usuarios?error=${encodeURIComponent("Nombre, correo y contraseña (mín. 8 caracteres) son obligatorios.")}`);
  }
  try {
    await prisma.user.create({ data: { email, name, passwordHash: await bcrypt.hash(password, 12) } });
  } catch {
    redirect(`/admin/usuarios?error=${encodeURIComponent("Ya existe un usuario con ese correo.")}`);
  }
  redirect(`/admin/usuarios?ok=${encodeURIComponent("Usuario creado")}`);
}

export async function deleteUser(id: number) {
  const session = await requireAdmin();
  if (session.uid === id) redirect(`/admin/usuarios?error=${encodeURIComponent("No puedes eliminar tu propio usuario.")}`);
  await prisma.user.delete({ where: { id } });
  redirect(`/admin/usuarios?ok=${encodeURIComponent("Usuario eliminado")}`);
}

export async function changePassword(formData: FormData) {
  const session = await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const user = await prisma.user.findUnique({ where: { id: session.uid } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
    redirect(`/admin/usuarios?error=${encodeURIComponent("La contraseña actual no es correcta.")}`);
  }
  if (next.length < 8) redirect(`/admin/usuarios?error=${encodeURIComponent("La nueva contraseña debe tener al menos 8 caracteres.")}`);
  await prisma.user.update({ where: { id: session.uid }, data: { passwordHash: await bcrypt.hash(next, 12) } });
  redirect(`/admin/usuarios?ok=${encodeURIComponent("Contraseña actualizada")}`);
}

/* ---------------- Primer administrador ---------------- */

export type SetupState = { error?: string };

/**
 * Crea el primer usuario administrador cuando la base está vacía (útil en Cloudflare D1).
 * En producción exige el código SETUP_CODE configurado como secreto del entorno.
 */
export async function createFirstAdmin(_prev: SetupState, formData: FormData): Promise<SetupState> {
  if ((await prisma.user.count()) > 0) return { error: "Ya existe un administrador. Inicia sesión." };

  const expected = process.env.SETUP_CODE;
  if (process.env.NODE_ENV === "production" && !expected) {
    return { error: "Falta configurar la variable secreta SETUP_CODE en el servidor." };
  }
  if (expected && String(formData.get("code") ?? "") !== expected) {
    return { error: "El código de configuración no es correcto." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 10) {
    return { error: "Escribe nombre, un correo válido y una contraseña de al menos 10 caracteres." };
  }

  const user = await prisma.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } });
  const token = await signSession({ uid: user.id, email: user.email, name: user.name });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.INSECURE_COOKIES !== "true",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}
