"use client";
import TC, { useTr } from "@/components/TC";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Aldo from "./Aldo";
import { whatsappLink } from "@/lib/utils";

export type AldoTopic = {
  id: string;
  label: string;
  answer: string;
  points?: string[];
  href?: string;
  price?: string;
  keywords: string[];
};

export type AldoKnowledge = {
  greeting: string;
  bubble: string;
  whatsapp: string;
  hours: string;
  topics: AldoTopic[];
  faqs: { q: string; a: string }[];
  quick: string[];
  /** true si el servidor tiene GROQ_API_KEY: el texto libre lo responde la IA. */
  ai?: boolean;
};

type Msg = { from: "aldo" | "me"; text: string; topic?: AldoTopic; chips?: string[]; wa?: boolean; link?: string };

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ");

const STOP = new Set("de la el los las un una y o a en con por para que me mi tu su es se lo al del quiero necesito tengo como hola buenas cual cuales hay sobre algo mas".split(" "));
const words = (s: string) => norm(s).split(/\s+/).filter((w) => (w.length > 2 || /\d/.test(w)) && !STOP.has(w));
const hits = (a: string[], b: string[]) => a.filter((w) => b.some((k) => k.startsWith(w.slice(0, 5)) || w.startsWith(k.slice(0, 5)))).length;

/** Aldo: asistente que guía por los servicios, responde preguntas frecuentes y pasa a WhatsApp. */
export default function AldoChat({ k }: { k: AldoKnowledge }) {
  const tr = useTr();
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [interest, setInterest] = useState<string>("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem("aldo-bubble") === "0"; } catch {}
    if (dismissed || !k.bubble) return;
    const t = setTimeout(() => setTeaser(true), 3500);
    return () => clearTimeout(t);
  }, [k.bubble]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const waHref = (topic?: string) => {
    const text = topic ? `Hola Aldore, vengo de la página web. Me interesa: ${topic}.` : "Hola Aldore, vengo de la página web y quiero más información.";
    return whatsappLink(k.whatsapp, text) || `/contacto${topic ? `?servicio=${encodeURIComponent(topic)}` : ""}`;
  };

  const say = (m: Msg) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((xs) => [...xs, m]);
    }, 550);
  };

  const start = () => {
    setOpen(true);
    setTeaser(false);
    try { sessionStorage.setItem("aldo-bubble", "0"); } catch {}
    if (msgs.length === 0) say({ from: "aldo", text: k.greeting, chips: k.quick });
  };

  const answerTopic = (t: AldoTopic) => {
    if (t.id === "humano") {
      const hours = k.hours.replace(/\.+$/, "");
      say({ from: "aldo", text: `¡Claro! Te paso con el equipo por WhatsApp.${hours ? ` Atendemos ${hours.charAt(0).toLowerCase()}${hours.slice(1)}.` : ""}`, wa: true });
      return;
    }
    if (t.id !== "precios") setInterest(t.label);
    say({ from: "aldo", text: t.answer, topic: t, chips: t.id === "precios" ? ["Hablar con una persona"] : ["¿Cuánto cuesta?", "Ver otros servicios", "Hablar con una persona"] });
  };

  const askAi = async (text: string) => {
    const history = [...msgs, { from: "me" as const, text }]
      .filter((m) => m.text)
      .slice(-10)
      .map((m) => ({ role: m.from === "me" ? "user" : "assistant", content: m.text }));
    setTyping(true);
    try {
      const r = await fetch("/api/aldo", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: history }) });
      if (!r.ok) throw new Error(String(r.status));
      const d = (await r.json()) as { text: string; wa?: boolean; link?: string };
      setTyping(false);
      setMsgs((xs) => [...xs, { from: "aldo", text: d.text, wa: d.wa, link: d.link, chips: ["Ver otros servicios", "Hablar con una persona"] }]);
    } catch {
      setTyping(false);
      keywordAnswer(text);
    }
  };

  const handle = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setMsgs((xs) => [...xs, { from: "me", text }]);
    setInput("");

    const n = norm(text);
    const byLabel = k.topics.find((t) => norm(t.label) === n);
    if (byLabel) return answerTopic(byLabel);
    if (n.includes("ver otros")) return say({ from: "aldo", text: "Esto es todo lo que hacemos. ¿Qué te interesa?", chips: k.topics.filter((t) => !["humano", "precios"].includes(t.id)).map((t) => t.label) });
    const isPriceChip = n === norm("¿Cuánto cuesta?");
    if (k.ai && !isPriceChip) return askAi(text);
    if (/(cuanto|precio|cuesta|valor|tarifa|cotiza)/.test(n)) {
      const current = k.topics.find((t) => t.label === interest);
      if (current?.price) return say({ from: "aldo", text: current.price, chips: ["Hablar con una persona", "Ver otros servicios"], wa: true });
      const p = k.topics.find((t) => t.id === "precios");
      if (p) return answerTopic(p);
    }

    keywordAnswer(text);
  };

  const keywordAnswer = (text: string) => {
    const w = words(text);
    let best: { t?: AldoTopic; f?: { q: string; a: string }; score: number } = { score: 0 };
    for (const t of k.topics) {
      const sc = hits(w, t.keywords) * 2 + hits(w, words(t.label));
      if (sc > best.score) best = { t, score: sc };
    }
    for (const f of k.faqs) {
      const sc = hits(w, words(f.q)) * 1.5;
      if (sc > best.score) best = { f, score: sc };
    }
    if (best.t && best.score >= 2) return answerTopic(best.t);
    if (best.f && best.score >= 2) return say({ from: "aldo", text: best.f.a, chips: ["Ver otros servicios", "Hablar con una persona"] });
    say({
      from: "aldo",
      text: "Mmm, eso no lo tengo claro todavía 🦉 Pero el equipo sí: escríbenos por WhatsApp y te respondemos con detalle.",
      chips: ["Ver otros servicios"],
      wa: true,
    });
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 flex flex-col items-end gap-3 sm:bottom-5 sm:right-5">
      {open && (
        <section
          aria-label="Chat con Aldo"
          className="flex h-[min(560px,calc(100dvh-7rem))] w-[min(370px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-ink-900/10 bg-paper shadow-2xl shadow-black/30 [animation:aldo-pop_.25s_ease-out]"
        >
          <header className="flex items-center gap-3 bg-ink-900 px-4 py-3 text-paper">
            <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-paper">
              <Aldo pose={typing ? "code" : "base"} follow={false} className={`mt-3 h-12 w-12 ${typing ? "aldo-chat-typing" : ""}`} />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="font-semibold"><TC>{"Aldo"}</TC></p>
              <p className="font-mono text-[11px] text-paper/60">{typing ? <span className="text-emerald-400"><TC>{"escribiendo…"}</TC></span> : <TC>{"asistente de Aldore"}</TC>}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Cerrar chat" className="grid h-8 w-8 place-items-center rounded-full text-paper/70 hover:bg-white/10 hover:text-paper">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === "me" ? "flex justify-end" : "space-y-2"}>
                <p className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[14px] leading-snug ${m.from === "me" ? "rounded-br-md bg-ink-900 text-paper" : "rounded-bl-md border border-paper-line bg-white text-ink-900"}`}>
                  {m.text}
                </p>
                {m.topic?.points && m.topic.points.length > 0 && (
                  <ul className="max-w-[88%] space-y-1 rounded-2xl border border-paper-line bg-white px-3.5 py-2.5 text-[13px] text-ink-700">
                    {m.topic.points.map((p) => <li key={p} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brand-500" />{p}</li>)}
                  </ul>
                )}
                {(m.topic?.href || m.link || m.wa) && (
                  <div className="flex flex-wrap gap-2">
                    {(m.topic?.href || m.link) && (
                      <Link href={(m.topic?.href || m.link)!} onClick={() => setOpen(false)} className="rounded-full border border-ink-900/20 bg-white px-3 py-1.5 text-[13px] font-medium text-ink-900 hover:border-ink-900"><TC>{"Ver más →"}</TC></Link>
                    )}
                    {m.wa && (
                      <a href={waHref(interest)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-[13px] font-semibold text-white hover:brightness-95"><TC>{"Escribir por WhatsApp ↗"}</TC></a>
                    )}
                  </div>
                )}
                {m.chips && i === msgs.length - 1 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.chips.map((c) => (
                      <button key={c} onClick={() => handle(c)} className="rounded-full border border-brand-500/40 bg-brand-500/5 px-3 py-1.5 text-[13px] text-brand-700 transition hover:bg-brand-500 hover:text-white">
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex items-end gap-2" aria-label="Aldo está escribiendo" role="status">
                <Aldo pose="code" follow={false} className="aldo-chat-typing h-11 w-11 shrink-0" title="" />
                <p className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-paper-line bg-white px-4 py-3">
                  {[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500" style={{ animationDelay: `${d * 0.15}s` }} />)}
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handle(input);
            }}
            className="flex items-center gap-2 border-t border-paper-line bg-white px-3 py-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tr("Escríbele a Aldo…")}
              aria-label="Mensaje para Aldo"
              className="min-w-0 flex-1 rounded-full border border-paper-line bg-paper px-4 py-2 text-[14px] outline-none focus:border-brand-500"
            />
            <button aria-label="Enviar" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 text-white hover:bg-brand-600">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
          <a href={waHref(interest)} target="_blank" rel="noopener noreferrer" className="bg-white pb-2 text-center text-[11px] text-ink-500 hover:text-ink-900"><TC>{"¿Prefieres hablar con una persona? "}</TC><span className="font-semibold text-[#128C7E]"><TC>{"WhatsApp ↗"}</TC></span>
          </a>
        </section>
      )}

      <div className="flex items-end gap-2">
        {teaser && !open && (
          <div className="relative mb-12 max-w-[220px] rounded-2xl rounded-br-sm border border-paper-line bg-white px-4 py-3 text-sm text-ink-900 shadow-lg [animation:aldo-pop_.35s_ease-out]">
            <button
              onClick={() => {
                setTeaser(false);
                try { sessionStorage.setItem("aldo-bubble", "0"); } catch {}
              }}
              aria-label="Cerrar mensaje"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 text-xs text-paper"
            >
              ×
            </button>
            <button onClick={start} className="block text-left">{k.bubble}</button>
          </div>
        )}
        <button
          onClick={() => (open ? setOpen(false) : start())}
          aria-label={open ? "Cerrar chat con Aldo" : "Hablar con Aldo"}
          aria-expanded={open}
          className="aldo-hover group relative block h-20 w-20"
        >
          <span className="absolute inset-0 overflow-hidden rounded-full border border-paper-line bg-paper shadow-xl shadow-black/25">
            <span className="aldo-peek absolute inset-x-0 -bottom-3 block [animation:aldo-peek_.7s_cubic-bezier(.2,.9,.3,1.2)_1.2s_both]">
              <Aldo pose="wave" className="mx-auto h-[84px] w-[84px]" />
            </span>
          </span>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white shadow ring-2 ring-white">
            {open ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="M6 6l12 12M18 6 6 18" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z" /></svg>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
