"use client";
import { useActionState, useEffect, useState } from "react";
import { login, resendLoginCode, verifyLoginCode, type LoginState } from "../actions";

export default function LoginForm({ notice }: { notice?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [codeStage, setCodeStage] = useState<LoginState | null>(null);

  useEffect(() => {
    if (state.step === "code") setCodeStage(state);
  }, [state]);

  if (codeStage) return <CodeForm initial={codeStage} onBack={() => setCodeStage(null)} />;

  return (
    <form action={action} className="mt-6 space-y-4">
      {notice && !state.error && <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{notice}</p>}
      <div>
        <label className="label" htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" className="input" autoComplete="username" defaultValue={state.email} key={state.email} required />
      </div>
      <div>
        <label className="label" htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" className="input" autoComplete="current-password" required />
      </div>
      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button className="btn-primary w-full" disabled={pending}>{pending ? "Ingresando…" : "Ingresar"}</button>
    </form>
  );
}

function CodeForm({ initial, onBack }: { initial: LoginState; onBack: () => void }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(verifyLoginCode, initial);
  const [resent, resend, resending] = useActionState<LoginState, FormData>(resendLoginCode, initial);
  const expired = !state.step || !resent.step;
  const msg = resending ? null : resent !== initial ? resent : null;

  if (expired) {
    return (
      <div className="mt-6 space-y-4">
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{(!state.step ? state.error : resent.error) || "Ingresa de nuevo."}</p>
        <button type="button" onClick={onBack} className="btn-primary w-full">Volver a ingresar</button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-xl bg-paper-2 px-4 py-3 text-sm text-ink-700">
        Te enviamos un código de 6 dígitos a <span className="font-medium text-ink-900">{initial.masked}</span>. Vence en 10 minutos.
      </div>
      <form action={action} className="space-y-4">
        <div>
          <label className="label" htmlFor="code">Código de verificación</label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,7}"
            maxLength={7}
            placeholder="000000"
            autoFocus
            required
            className="input text-center font-mono text-2xl tracking-[0.5em]"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" name="remember" className="h-4 w-4 rounded border-paper-line" />
          No pedir código en este equipo por 30 días
        </label>
        {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
        {msg?.error && !state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{msg.error}</p>}
        {msg?.info && !state.error && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{msg.info}</p>}
        <button className="btn-primary w-full" disabled={pending}>{pending ? "Verificando…" : "Verificar y entrar"}</button>
      </form>
      <div className="flex items-center justify-between text-sm">
        <button type="button" onClick={onBack} className="text-ink-500 hover:text-ink-900">← Cambiar de cuenta</button>
        <form action={resend}>
          <button className="font-medium text-brand-600 hover:underline disabled:opacity-50" disabled={resending}>{resending ? "Enviando…" : "Reenviar código"}</button>
        </form>
      </div>
    </div>
  );
}
