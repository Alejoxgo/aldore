import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions, touchSession } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin/login") || pathname === "/admin/salir") return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const result = await touchSession(token);
  if (!result) {
    if (pathname.startsWith("/api/admin")) {
      const res = NextResponse.json({ error: "No autorizado" }, { status: 401 });
      if (token) res.cookies.delete(SESSION_COOKIE);
      return res;
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = token ? "?motivo=inactividad" : "";
    const res = NextResponse.redirect(url);
    if (token) res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  const res = NextResponse.next();
  // Cada visita o acción en el panel cuenta como actividad: se renueva la marca de tiempo.
  if (result.renewed) res.cookies.set(SESSION_COOKIE, result.renewed, sessionCookieOptions());
  return res;
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
