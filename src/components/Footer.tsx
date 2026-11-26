import Link from "next/link";
import Logo from "./Logo";
import type { Settings } from "@/lib/settings";

export default function Footer({ s, services }: { s: Settings; services: { slug: string; title: string }[] }) {
  const socials = [
    ["Instagram", s["social.instagram"]],
    ["LinkedIn", s["social.linkedin"]],
    ["Facebook", s["social.facebook"]],
    ["X", s["social.x"]],
  ].filter(([, url]) => url);
  return (
    <footer className="bg-ink-900 text-slate-400">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo name={s["site.name"]} light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{s["footer.text"]}</p>
          {socials.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              {socials.map(([label, url]) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Servicios</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((sv) => (
              <li key={sv.slug}>
                <Link href={`/servicios/${sv.slug}`} className="hover:text-white">
                  {sv.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Contacto</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={`mailto:${s["contact.email"]}`} className="hover:text-white">{s["contact.email"]}</a></li>
            <li>{s["contact.phone"]}</li>
            <li>{s["contact.address"]}</li>
            <li>{s["contact.hours"]}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {s["site.name"]}. Todos los derechos reservados.</p>
          <p>{s["site.tagline"]}</p>
        </div>
      </div>
    </footer>
  );
}
