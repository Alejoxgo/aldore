// Genera migrations/0002_contenido_inicial.sql con el contenido de ejemplo para Cloudflare D1.
// Uso: node prisma/seed-sql.mjs   (no crea usuarios: el primer admin se crea en /admin/login)
import { writeFileSync } from "node:fs";
import { services, products, plans, testimonials, faqs } from "./seed-data.mjs";

const q = (v) =>
  typeof v === "boolean" ? (v ? "1" : "0") : typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`;

function inserts(table, rows, extra = {}) {
  return rows
    .map((row) => {
      const r = { ...extra, ...row };
      const cols = Object.keys(r);
      return `INSERT INTO "${table}" (${cols.map((c) => `"${c}"`).join(", ")}, "updatedAt") VALUES (${cols.map((c) => q(r[c])).join(", ")}, CURRENT_TIMESTAMP);`;
    })
    .join("\n");
}

const sql = [
  "-- Contenido inicial de ejemplo (editable luego desde el panel).",
  inserts("Service", services.map((s, i) => ({ ...s, order: i }))),
  inserts("Product", products),
  inserts("Plan", plans),
  inserts("Testimonial", testimonials),
  inserts("Faq", faqs),
  "",
].join("\n");

writeFileSync(new URL("../migrations/0002_contenido_inicial.sql", import.meta.url), sql);
console.log("✓ migrations/0002_contenido_inicial.sql generado");
