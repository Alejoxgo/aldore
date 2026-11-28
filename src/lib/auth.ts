import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "./session";

export async function getSession() {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/** Úsalo al inicio de cada server action / página del panel. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export const ROLES = { admin: "Administrador", editor: "Editor" } as const;
export type Role = keyof typeof ROLES;

/** El rol se lee de la base (no de la cookie), así un cambio de rol aplica de inmediato. */
export async function currentRole(uid: number): Promise<Role> {
  const { prisma } = await import("./db");
  const u = await prisma.user.findUnique({ where: { id: uid }, select: { role: true } });
  return u?.role === "editor" ? "editor" : "admin";
}

/** Solo un administrador puede crear, editar o eliminar usuarios. */
export async function requireOwner() {
  const session = await requireAdmin();
  if ((await currentRole(session.uid)) !== "admin") {
    redirect(`/admin/usuarios?error=${encodeURIComponent("Solo un administrador puede crear, editar o eliminar usuarios.")}`);
  }
  return session;
}
