"use client";
import { useActionState } from "react";
import { createFirstAdmin, type SetupState } from "../actions";

export default function SetupForm({ needsCode }: { needsCode: boolean }) {
  const [state, action, pending] = useActionState<SetupState, FormData>(createFirstAdmin, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      {needsCode && (
        <div>
          <label className="label" htmlFor="code">Código de configuración</label>
          <input id="code" name="code" type="password" className="input" required autoComplete="off" />
          <p className="mt-1 text-xs text-slate-500">Es el valor de la variable secreta SETUP_CODE.</p>
        </div>
      )}
      <div>
        <label className="label" htmlFor="name">Tu nombre</label>
        <input id="name" name="name" className="input" required autoComplete="name" />
      </div>
      <div>
        <label className="label" htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" className="input" required autoComplete="username" />
      </div>
      <div>
        <label className="label" htmlFor="password">Contraseña (mín. 10 caracteres)</label>
        <input id="password" name="password" type="password" minLength={10} className="input" required autoComplete="new-password" />
      </div>
      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button className="btn-primary w-full" disabled={pending}>{pending ? "Creando…" : "Crear administrador"}</button>
    </form>
  );
}
