import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import Logo from "@/components/Logo";
import Aldo from "@/components/Aldo";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Ingreso al panel", robots: { index: false } };

export default async function LoginPage() {
  const s = await getSettings();
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-2 flex flex-col items-center gap-4"><Logo name={s["site.name"]} light /><Aldo pose="code" className="h-28 w-28" /></div>
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-ink-900">Panel de administración</h1>
          <p className="mt-1 text-sm text-slate-500">Ingresa con tu cuenta de administrador.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
