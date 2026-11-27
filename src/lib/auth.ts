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
