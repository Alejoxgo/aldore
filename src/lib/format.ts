const cop = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export function money(n: number | null | undefined) {
  return cop.format(n ?? 0);
}

/** "2026-11-27" → "27 nov 2026" */
export function shortDate(v: string | null | undefined) {
  if (!v) return "";
  const d = new Date(`${v.length === 7 ? v + "-01" : v}T12:00:00`);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("es-CO", v.length === 7 ? { month: "long", year: "numeric" } : { day: "numeric", month: "short", year: "numeric" });
}

/** Mes actual en formato AAAA-MM (hora de Colombia). */
export function currentPeriod() {
  return new Date(Date.now() - 5 * 3600_000).toISOString().slice(0, 7);
}
