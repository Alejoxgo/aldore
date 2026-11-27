export default function Flash({ ok, error }: { ok?: string; error?: string }) {
  if (!ok && !error) return null;
  return (
    <div className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
      {error || ok}
    </div>
  );
}
