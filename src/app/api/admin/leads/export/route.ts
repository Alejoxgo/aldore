import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  if (!(await getSession())) return new Response("No autorizado", { status: 401 });
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  const cols = ["id", "createdAt", "name", "email", "phone", "company", "service", "status", "message", "notes"] as const;
  const esc = (v: unknown) => {
    let s = v instanceof Date ? v.toISOString() : String(v ?? "");
    if (/^[=+\-@]/.test(s)) s = "'" + s; // evita inyección de fórmulas en Excel
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = [cols.join(","), ...leads.map((l) => cols.map((c) => esc(l[c])).join(","))].join("\n");
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
