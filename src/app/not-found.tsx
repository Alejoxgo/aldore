import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-900 px-4 text-center text-white">
      <p className="text-7xl font-black gradient-text">404</p>
      <h1 className="mt-4 text-2xl font-bold">Página no encontrada</h1>
      <Link href="/" className="btn-primary mt-8">Volver al inicio</Link>
    </div>
  );
}
