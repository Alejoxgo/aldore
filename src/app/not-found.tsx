import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center text-ink-900">
      <p className="font-display text-8xl">404<span className="text-brand-500">.</span></p>
      <h1 className="mt-4 text-xl text-ink-700">Página no encontrada</h1>
      <Link href="/" className="btn-primary mt-8">Volver al inicio</Link>
    </div>
  );
}
