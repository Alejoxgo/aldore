import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Sidebar from "@/components/admin/Sidebar";
import Logo from "@/components/Logo";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Panel admin", robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const [newLeads, pendingRequests] = await Promise.all([
    prisma.lead.count({ where: { status: "nuevo" } }),
    prisma.staffRequest.count({ where: { status: "pendiente" } }),
  ]);
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo name="Admin" />
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" target="_blank" className="hidden text-slate-600 hover:text-brand-700 sm:inline">Ver sitio ↗</Link>
            <span className="hidden text-slate-400 sm:inline">|</span>
            <span className="hidden text-slate-600 md:inline">{session.name}</span>
            <form action={logout}>
              <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100">Salir</button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside>
          <Sidebar newLeads={newLeads} pendingRequests={pendingRequests} />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
