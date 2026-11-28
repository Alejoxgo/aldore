import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Flash from "@/components/admin/Flash";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { changePassword, createUser, deleteUser } from "../../actions";

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const session = await requireAdmin();
  const { ok, error } = await searchParams;
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink-900">Usuarios administradores</h1>
        <p className="mt-1 text-sm text-slate-500">Personas con acceso a este panel.</p>
      </div>
      <Flash ok={ok} error={error} />
      <div className="divide-y divide-slate-100 rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,.04)]">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-ink-900">{u.name} {u.id === session.uid && <span className="text-xs text-slate-400">(tú)</span>}</p>
              <p className="text-sm text-slate-500">{u.email}</p>
            </div>
            {u.id !== session.uid && (
              <form action={deleteUser.bind(null, u.id)}>
                <ConfirmButton message={`¿Eliminar a ${u.name}?`} className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Eliminar</ConfirmButton>
              </form>
            )}
          </div>
        ))}
      </div>
      <form action={createUser} className="grid gap-4 rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,.04)] p-6 sm:grid-cols-3">
        <h2 className="font-semibold text-ink-900 sm:col-span-3">Agregar administrador</h2>
        <input name="name" placeholder="Nombre" className="input" required />
        <input name="email" type="email" placeholder="Correo" className="input" required />
        <input name="password" type="password" placeholder="Contraseña (mín. 8)" minLength={8} className="input" required />
        <div className="sm:col-span-3"><button className="btn-primary">Crear usuario</button></div>
      </form>
      <form action={changePassword} className="grid gap-4 rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,.04)] p-6 sm:grid-cols-2">
        <h2 className="font-semibold text-ink-900 sm:col-span-2">Cambiar mi contraseña</h2>
        <input name="current" type="password" placeholder="Contraseña actual" className="input" required />
        <input name="next" type="password" placeholder="Nueva contraseña (mín. 8)" minLength={8} className="input" required />
        <div className="sm:col-span-2"><button className="btn-primary">Actualizar contraseña</button></div>
      </form>
    </div>
  );
}
