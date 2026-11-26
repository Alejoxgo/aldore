export const LEAD_STATUSES = ["nuevo", "contactado", "en negociación", "ganado", "perdido"] as const;

export const STATUS_STYLES: Record<string, string> = {
  nuevo: "bg-brand-100 text-brand-800",
  contactado: "bg-amber-100 text-amber-800",
  "en negociación": "bg-violet-100 text-violet-800",
  ganado: "bg-emerald-100 text-emerald-800",
  perdido: "bg-slate-200 text-slate-700",
};
