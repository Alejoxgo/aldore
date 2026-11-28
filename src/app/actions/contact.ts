"use server";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { esc, mailLayout, mailReady, rows, sendMail } from "@/lib/mail";

export type ContactState = { ok: boolean; message: string; errors?: Record<string, string>; values?: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot anti-spam: los humanos no ven este campo.
  if (String(formData.get("website") ?? "").trim()) return { ok: true, message: "¡Gracias! Te contactaremos pronto." };

  const get = (k: string, max = 200) => String(formData.get(k) ?? "").trim().slice(0, max);
  const data = {
    name: get("name"),
    email: get("email"),
    phone: get("phone", 40),
    company: get("company"),
    service: get("service"),
    message: get("message", 5000),
  };

  const errors: Record<string, string> = {};
  if (data.name.length < 2) errors.name = "Escribe tu nombre.";
  if (!EMAIL_RE.test(data.email)) errors.email = "Escribe un correo válido.";
  if (data.message.length < 10) errors.message = "Cuéntanos un poco más (mínimo 10 caracteres).";
  if (Object.keys(errors).length) return { ok: false, message: "Revisa los campos marcados.", errors, values: data };

  const lead = await prisma.lead.create({ data });
  if (mailReady()) await notifyLead(lead.id, data).catch((e) => console.error("Aviso de contacto", e));
  return { ok: true, message: "¡Gracias! Recibimos tu mensaje y te contactaremos en menos de 48 horas." };
}

async function notifyLead(id: number, d: { name: string; email: string; phone: string; company: string; service: string; message: string }) {
  const s = await getSettings();
  const site = (process.env.SITE_URL || "https://aldore.co").replace(/\/$/, "");
  const from = s["notify.from"] || undefined;
  const to = (s["notify.email"] || s["contact.email"] || "").split(",").map((x) => x.trim()).filter(Boolean);
  const jobs: Promise<unknown>[] = [];
  if (to.length) {
    jobs.push(
      sendMail({
        to,
        from,
        replyTo: d.email,
        subject: `Nueva solicitud: ${d.name}${d.service ? ` · ${d.service}` : ""}`,
        html: mailLayout(
          "Llegó una nueva solicitud desde el sitio",
          rows([["Nombre", d.name], ["Correo", d.email], ["Teléfono", d.phone], ["Empresa", d.company], ["Servicio", d.service], ["Mensaje", d.message]]) +
            `<p style="margin:24px 0 0"><a href="${site}/admin/leads/${id}" style="display:inline-block;background:#16130f;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-size:14px">Abrir en el panel</a></p>
<p style="margin:12px 0 0;font-size:13px;color:#6b6358">Puedes responder este correo y le llega directo a ${esc(d.name)}.</p>`,
          "Aviso automático del sitio aldore.co",
        ),
      }),
    );
  }
  const auto = (s["notify.autoReply"] || "").trim();
  if (auto) {
    const first = d.name.split(/\s+/)[0];
    jobs.push(
      sendMail({
        to: d.email,
        from,
        replyTo: to[0],
        subject: "Recibimos tu mensaje · Aldore",
        html: mailLayout(
          `¡Gracias, ${esc(first)}!`,
          `<p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(auto.replace(/\{nombre\}/g, first))}</p>`,
          `Aldore · ${esc(s["contact.email"] || "hola@aldore.co")}`,
        ),
      }),
    );
  }
  await Promise.all(jobs);
}
