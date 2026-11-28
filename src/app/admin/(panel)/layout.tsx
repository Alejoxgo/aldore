import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Sidebar from "@/components/admin/Sidebar";
import AdminIcon from "@/components/admin/AdminIcon";
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
    <div className="min-h-screen bg-[#f6f5f2]">
      <Sidebar
        newLeads={newLeads}
        pendingRequests={pendingRequests}
        user={{ name: session.name, email: session.email }}
        brand={
          <Link href="/admin" className="flex items-center gap-2.5">
            <Logo name="aldore" light />
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper/60">panel</span>
          </Link>
        }
        logout={
          <form action={logout}>
            <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 py-1.5 text-xs text-paper/70 transition hover:border-brand-500/60 hover:text-white">
              <AdminIcon name="logout" className="h-3.5 w-3.5" /> Salir
            </button>
          </form>
        }
      />
      <div className="lg:pl-64">
        <main className="mx-auto min-w-0 max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
