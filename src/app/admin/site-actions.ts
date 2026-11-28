"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { translateLater } from "@/lib/i18n";
import { DRAFT, SETTINGS_GROUPS, SETTING_KEYS } from "@/lib/settings";
import { SEASONS } from "@/lib/season";

/* ---------------- Temáticas ---------------- */

const MODES = new Set(["auto", "ninguna", ...Object.keys(SEASONS)]);

/** Activa una temática (o automático / ninguna) y decide si caen detalles. */
export async function setTheme(mode: string, effects: boolean) {
  await requireAdmin();
  if (!MODES.has(mode)) return { ok: false };
  for (const [key, value] of [["theme.mode", mode], ["theme.effects", effects ? "sí" : "no"]]) {
    await prisma.setting.upsert({ where: { key }, create: { key, value }, update: { value } });
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

/* ---------------- Editor visual: borrador → publicar ---------------- */

async function published() {
  const out: Record<string, string> = {};
  for (const g of SETTINGS_GROUPS) for (const f of g.fields) out[f.key] = f.default;
  const rows = await prisma.setting.findMany();
  for (const r of rows) if (!r.key.startsWith(DRAFT)) out[r.key] = r.value;
  return out;
}

/** Guarda los cambios del editor como borrador (no se ven en el sitio hasta publicar). Devuelve cuántos hay pendientes. */
export async function saveDraft(values: Record<string, string>) {
  await requireAdmin();
  const pub = await published();
  for (const [k, raw] of Object.entries(values)) {
    if (!SETTING_KEYS.has(k)) continue;
    const v = String(raw ?? "").replace(/\r\n/g, "\n").slice(0, 20000);
    const key = DRAFT + k;
    if (v === pub[k]) await prisma.setting.deleteMany({ where: { key } });
    else await prisma.setting.upsert({ where: { key }, create: { key, value: v }, update: { value: v } });
  }
  return { pending: await prisma.setting.count({ where: { key: { startsWith: DRAFT } } }) };
}

/** Publica el borrador: pasa al sitio real y se traduce a los idiomas activos. */
export async function publishDraft() {
  await requireAdmin();
  const drafts = await prisma.setting.findMany({ where: { key: { startsWith: DRAFT } } });
  for (const d of drafts) {
    const key = d.key.slice(DRAFT.length);
    if (!SETTING_KEYS.has(key)) continue;
    await prisma.setting.upsert({ where: { key }, create: { key, value: d.value }, update: { value: d.value } });
  }
  await prisma.setting.deleteMany({ where: { key: { startsWith: DRAFT } } });
  translateLater(drafts.map((d) => d.value));
  revalidatePath("/", "layout");
  return { published: drafts.length };
}

/** Descarta el borrador y vuelve a lo publicado. */
export async function discardDraft() {
  await requireAdmin();
  await prisma.setting.deleteMany({ where: { key: { startsWith: DRAFT } } });
  return { ok: true };
}

/* ---------------- Aldo, el asistente del editor ---------------- */

const ASSIST: Record<string, string> = {
  mejorar: "Mejora la redacción: más clara, profesional y cercana. Mantén la idea y una longitud parecida.",
  corto: "Hazlo más corto y directo, sin perder lo importante.",
  vender: "Hazlo más persuasivo y orientado a que el cliente nos contacte, sin exagerar ni prometer cosas que no se dicen.",
  ortografia: "Corrige solo ortografía, tildes y puntuación. No cambies el estilo.",
  ideas: "Propón una versión nueva, fresca y profesional del mismo texto.",
};

/** Aldo reescribe un texto del sitio con Groq. Devuelve la propuesta; tú decides si la usas. */
export async function aldoAssist(input: { key: string; value: string; mode: string; prompt?: string }) {
  await requireAdmin();
  const key = process.env.GROQ_API_KEY;
  if (!key) return { ok: false as const, text: "Aldo necesita la clave GROQ_API_KEY en Cloudflare para ayudarte a escribir." };
  const field = SETTINGS_GROUPS.flatMap((g) => g.fields.map((f) => ({ ...f, group: g.title }))).find((f) => f.key === input.key);
  const task = input.prompt?.trim() ? `Instrucción del usuario: ${input.prompt.trim().slice(0, 500)}` : ASSIST[input.mode] || ASSIST.mejorar;
  const sys = `Eres Aldo, el búho asistente de Aldore, un estudio de software en Medellín, Colombia. Ayudas a escribir los textos de su sitio web en español de Colombia, con tono profesional, cálido y claro (tuteo).
Reglas:
- Devuelve SOLO el texto final, sin comillas, sin explicaciones ni encabezados.
- Respeta el formato: si hay *asteriscos* para resaltar una palabra, conserva uno igual. Si el texto usa líneas, | , ; o = como estructura, conserva exactamente esa estructura.
- No inventes datos (precios, cifras, clientes) que no estén en el texto.`;
  const user = `Campo: ${field ? `${field.group} → ${field.label}` : input.key}${field?.help ? ` (${field.help})` : ""}
Texto actual:
${input.value || "(vacío)"}

${task}`;
  try {
    const r = await fetch(process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        temperature: input.mode === "ortografia" ? 0.1 : 0.6,
        messages: [{ role: "system", content: sys }, { role: "user", content: user }],
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (!r.ok) return { ok: false as const, text: `Groq respondió con error ${r.status}. Revisa la clave en Panel → Idioma del sitio → Probar conexión.` };
    const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const text = (data.choices?.[0]?.message?.content || "").trim().replace(/^["“](.*)["”]$/s, "$1");
    return text ? { ok: true as const, text } : { ok: false as const, text: "Aldo no encontró qué proponer. Intenta de nuevo." };
  } catch {
    return { ok: false as const, text: "No pude hablar con Groq ahora. Intenta en un momento." };
  }
}
