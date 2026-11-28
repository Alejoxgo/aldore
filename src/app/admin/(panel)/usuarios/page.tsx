import { prisma } from "@/lib/db";
import { ROLES, currentRole, requireAdmin } from "@/lib/auth";
import Flash from "@/components/admin/Flash";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { changePassword, createUser, deleteUser, updateMyProfile, updateUser } from "../../actions";
import AvatarPicker from "@/components/admin/AvatarPicker";
import { UserAvatar } from "@/components/AldoAvatar";

const box = "rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,.04)]";

function RoleSelect({ value, disabled }: { value: string; disabled?: boolean }) {
  return (
    <select name="role" defaultValue={value} className="input" disabled={disabled}>
      {Object.entries(ROLES).map(([k, label]) => (
        <option key={k} value={k}>{label}</option>
      ))}
    </select>
  );
}

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const session = await requireAdmin();
  const { ok, error } = await searchParams;
  const [role, users] = await Promise.all([currentRole(session.uid), prisma.user.findMany({ orderBy: { createdAt: "asc" } })]);
  const owner = role === "admin";
  const me = users.find((u) => u.id === session.uid);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink-900">Usuarios del panel</h1>
        <p className="mt-1 text-sm text-slate-500">
          Los <b>administradores</b> crean, editan y eliminan usuarios y manejan todo el panel. Los <b>editores</b> manejan el contenido, pero no los usuarios.
        </p>
      </div>
      <Flash ok={ok} error={error} />

      {me && (
        <form action={updateMyProfile} className={`grid gap-4 p-6 sm:grid-cols-2 ${box}`}>
          <h2 className="font-semibold text-ink-900 sm:col-span-2">Mi perfil</h2>
          <label className="text-sm"><span className="label">Nombre</span><input name="name" defaultValue={me.name} className="input" required /></label>
          <label className="text-sm"><span className="label">Cargo</span><input name="title" defaultValue={me.title} placeholder="Ej: Gerente, Desarrollador, Soporte" className="input" /></label>
          <div className="sm:col-span-2"><span className="label">Foto de perfil</span><AvatarPicker name={me.name} value={me.avatar} /></div>
          <div className="sm:col-span-2"><button className="btn-primary">Guardar mi perfil</button></div>
        </form>
      )}

      {!owner && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Tu rol es <b>Editor</b>. Solo un administrador puede crear, editar o eliminar usuarios. Aquí puedes cambiar tu contraseña.
        </p>
      )}

      {owner && (
        <div className={`divide-y divide-slate-100 ${box}`}>
          {users.map((u) => {
            const self = u.id === session.uid;
            return (
              <details key={u.id} className="group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar avatar={u.avatar} name={u.name} className="h-11 w-11" />
                    <div className="min-w-0">
                      <p className="font-medium text-ink-900">
                        {u.name} {self && <span className="text-xs text-slate-400">(tú)</span>}
                      </p>
                      <p className="truncate text-sm text-slate-500">{u.title ? `${u.title} · ` : ""}{u.email}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.role === "editor" ? "bg-sky-50 text-sky-700" : "bg-brand-50 text-brand-700"}`}>
                      {u.role === "editor" ? ROLES.editor : ROLES.admin}
                    </span>
                    <span className="text-xs font-medium text-ink-700 group-open:hidden">Editar</span>
                    <span className="hidden text-xs font-medium text-ink-700 group-open:inline">Cerrar</span>
                  </div>
                </summary>
                <form action={updateUser.bind(null, u.id)} className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-sm"><span className="label">Nombre</span><input name="name" defaultValue={u.name} className="input" required /></label>
                  <label className="text-sm"><span className="label">Correo</span><input name="email" type="email" defaultValue={u.email} className="input" required /></label>
                  <label className="text-sm">
                    <span className="label">Rol</span>
                    <RoleSelect value={u.role === "editor" ? "editor" : "admin"} disabled={self} />
                    {self && <input type="hidden" name="role" value="admin" />}
                  </label>
                  <label className="text-sm"><span className="label">Cargo</span><input name="title" defaultValue={u.title} className="input" /></label>
                  <label className="text-sm"><span className="label">Nueva contraseña (opcional)</span><input name="password" type="password" minLength={10} placeholder="Déjala vacía para no cambiarla" className="input" autoComplete="new-password" /></label>
                  <div className="sm:col-span-2"><span className="label">Foto de perfil</span><AvatarPicker name={u.name} value={u.avatar} /></div>
                  <div className="flex items-center justify-between gap-3 sm:col-span-2">
                    <button className="btn-primary">Guardar cambios</button>
                  </div>
                </form>
                {!self && (
                  <form action={deleteUser.bind(null, u.id)} className="mt-3">
                    <ConfirmButton message={`¿Eliminar a ${u.name}? Ya no podrá entrar al panel.`} className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Eliminar usuario</ConfirmButton>
                  </form>
                )}
              </details>
            );
          })}
        </div>
      )}

      {owner && (
        <form action={createUser} className={`grid gap-4 p-6 sm:grid-cols-2 ${box}`}>
          <h2 className="font-semibold text-ink-900 sm:col-span-2">Agregar usuario</h2>
          <input name="name" placeholder="Nombre" className="input" required />
          <input name="email" type="email" placeholder="Correo" className="input" required />
          <input name="title" placeholder="Cargo (ej. Diseñadora)" className="input" />
          <input name="password" type="password" placeholder="Contraseña (mín. 10)" minLength={10} className="input" required autoComplete="new-password" />
          <RoleSelect value="editor" />
          <div className="sm:col-span-2"><button className="btn-primary">Crear usuario</button></div>
        </form>
      )}

      <form action={changePassword} className={`grid gap-4 p-6 sm:grid-cols-2 ${box}`}>
        <h2 className="font-semibold text-ink-900 sm:col-span-2">Cambiar mi contraseña</h2>
        <input name="current" type="password" placeholder="Contraseña actual" className="input" required />
        <input name="next" type="password" placeholder="Nueva contraseña (mín. 10)" minLength={10} className="input" required />
        <div className="sm:col-span-2"><button className="btn-primary">Actualizar contraseña</button></div>
      </form>
    </div>
  );
}
