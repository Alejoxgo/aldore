"use client";
import { useRef } from "react";

/** Selector de estado que guarda al cambiar. */
export default function StatusSelect({
  action,
  value,
  options,
  className,
}: {
  action: (formData: FormData) => Promise<void>;
  value: string;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form action={action} ref={ref}>
      <select
        name="status"
        defaultValue={value}
        onChange={() => ref.current?.requestSubmit()}
        aria-label="Cambiar estado"
        className={`cursor-pointer appearance-none rounded-full border-0 py-0.5 pl-2.5 pr-6 text-xs font-semibold focus:ring-2 focus:ring-brand-400 ${className ?? ""}`}
        style={{ backgroundImage: "none" }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </form>
  );
}
