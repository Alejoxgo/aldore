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
    <footer className="bg-ink-900 text-paper/70">
      <div className="container-x py-16">
        <p className="max-w-3xl font-serif text-3xl leading-tight text-paper sm:text-4xl">
          ¿Tienes un proyecto en mente?{" "}
          <Link href="/contacto" className="text-brand-400 underline decoration-1 underline-offset-[6px] hover:text-brand-300">
            Escríbenos
          </Link>
          .
        </p>
        <div className="mt-14 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo name={s["site.name"]} light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">{s["footer.text"]}</p>
            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-4 text-sm">
                {socials.map(([label, url]) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="eyebrow !text-paper/50">Servicios</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {services.map((sv) => (
                <li key={sv.slug}>
                  <Link href={`/servicios/${sv.slug}`} className="hover:text-paper">
                    {sv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="eyebrow !text-paper/50">Contacto</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href={`mailto:${s["contact.email"]}`} className="hover:text-paper">{s["contact.email"]}</a></li>
              <li>{s["contact.phone"]}</li>
              <li>{s["contact.address"]}</li>
              <li>{s["contact.hours"]}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-2 text-xs text-paper/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {s["site.name"]}</p>
          <p>{s["site.tagline"]}</p>
        </div>
      </div>
    </footer>
  );
}
