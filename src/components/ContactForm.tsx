"use client";
import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";

const initial: ContactState = { ok: false, message: "" };

export default function ContactForm({ services, defaultService = "" }: { services: string[]; defaultService?: string }) {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-accent-500/30 bg-accent-500/10 p-8 text-center">
        <p className="text-lg font-semibold text-ink-900">{state.message}</p>
      </div>
    );
  }

  const v = state.values ?? {};
  const err = (k: string) => state.errors?.[k] && <p className="mt-1 text-xs text-red-600">{state.errors[k]}</p>;

  return (
    <form key={JSON.stringify(v)} action={action} className="grid gap-4 sm:grid-cols-2" noValidate>
      <div>
        <label className="label" htmlFor="cf-name">Nombre *</label>
        <input id="cf-name" name="name" defaultValue={v.name} className="input" autoComplete="name" required />
        {err("name")}
      </div>
      <div>
        <label className="label" htmlFor="cf-email">Correo *</label>
        <input id="cf-email" name="email" defaultValue={v.email} type="email" className="input" autoComplete="email" required />
        {err("email")}
      </div>
      <div>
        <label className="label" htmlFor="cf-phone">Teléfono / WhatsApp</label>
        <input id="cf-phone" name="phone" defaultValue={v.phone} className="input" autoComplete="tel" />
      </div>
      <div>
        <label className="label" htmlFor="cf-company">Empresa</label>
        <input id="cf-company" name="company" defaultValue={v.company} className="input" autoComplete="organization" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="cf-service">¿Qué necesitas?</label>
        <select id="cf-service" name="service" className="input" defaultValue={v.service ?? defaultService}>
          <option value="">Selecciona una opción</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
          <option value="Otro">Otro</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="cf-message">Cuéntanos tu proyecto *</label>
        <textarea id="cf-message" name="message" defaultValue={v.message} rows={5} className="input" required />
        {err("message")}
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Enviando…" : "Enviar mensaje"}
        </button>
        {state.message && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}
      </div>
    </form>
  );
}
