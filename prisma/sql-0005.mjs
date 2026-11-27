// Genera migrations/0005_servicios_nuevos.sql (servicios nuevos y preguntas de Puerta). Uso: node prisma/sql-0005.mjs
import { writeFileSync } from "node:fs";
import { services, newServices } from "./seed-data.mjs";

const q = (v) => (typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
const rows = newServices.map((s, i) => {
  const r = { ...s, order: services.length + i };
  const cols = Object.keys(r);
  return `INSERT OR IGNORE INTO "Service" (${cols.map((c) => `"${c}"`).join(", ")}, "updatedAt") VALUES (${cols.map((c) => q(r[c])).join(", ")}, CURRENT_TIMESTAMP);`;
});
const faqs = [
  ["¿Cuánto cuesta una Puerta by Aldore?", "Desde $120.000 de instalación y $35.000 al mes con QR. Con stickers NFC son $250.000 de instalación y $49.000 al mes. Si pagas el año por adelantado, te regalamos 2 meses."],
  ["¿Mis clientes tienen que descargar una app para usar la Puerta?", "No. Escanean el QR con la cámara o acercan el celular al sticker NFC y se abre tu página al instante, en cualquier celular."],
].map(([qq, a], i) => `INSERT INTO "Faq" ("question", "answer", "order", "updatedAt") VALUES (${q(qq)}, ${q(a)}, ${20 + i}, CURRENT_TIMESTAMP);`);
writeFileSync(new URL("../migrations/0005_servicios_nuevos.sql", import.meta.url), ["-- Servicios nuevos (si ya existen con ese slug, no se tocan)", ...rows, "", "-- Preguntas frecuentes de Puerta", ...faqs, ""].join("\n"));
console.log("ok");
