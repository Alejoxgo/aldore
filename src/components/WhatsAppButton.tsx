"use client";
import { useEffect, useState } from "react";
import Aldo from "./Aldo";
import { whatsappLink } from "@/lib/utils";

/** Aldo asoma en la esquina y abre WhatsApp (o el formulario si no hay número). */
export default function WhatsAppButton({ number, bubble }: { number: string; bubble: string }) {
  const href = whatsappLink(number, "Hola Aldo, quiero información sobre sus servicios.") || "/contacto";
  const external = href.startsWith("http");
  const [show, setShow] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem("aldo-bubble") === "0"; } catch {}
    if (dismissed || !bubble) return;
    const t = setTimeout(() => setShow(true), 3500);
    return () => clearTimeout(t);
  }, [bubble]);

  const close = () => {
    setShow(false);
    try { sessionStorage.setItem("aldo-bubble", "0"); } catch {}
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 flex items-end gap-2 sm:bottom-5 sm:right-5">
      {show && (
        <div className="aldo-pop relative mb-12 max-w-[220px] rounded-2xl rounded-br-sm border border-paper-line bg-white px-4 py-3 text-sm text-ink-900 shadow-lg [animation:aldo-pop_.35s_ease-out]">
          <button onClick={close} aria-label="Cerrar mensaje" className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 text-xs text-paper">×</button>
          <a href={href} target={external ? "_blank" : undefined} rel="noopener noreferrer" className="block">
            {bubble}
          </a>
        </div>
      )}
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel="noopener noreferrer"
        aria-label={external ? "Escríbele a Aldo por WhatsApp" : "Contáctanos"}
        className="aldo-hover group relative block h-20 w-20"
      >
        <span className="absolute inset-0 overflow-hidden rounded-full border border-paper-line bg-paper shadow-xl shadow-black/25">
          <span className="aldo-peek absolute inset-x-0 -bottom-3 block [animation:aldo-peek_.7s_cubic-bezier(.2,.9,.3,1.2)_1.2s_both]">
            <Aldo pose="wave" className="mx-auto h-[84px] w-[84px]" />
          </span>
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white shadow ring-2 ring-white">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
          </svg>
        </span>
      </a>
    </div>
  );
}
