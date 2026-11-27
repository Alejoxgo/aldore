// Genera supabase/aldore.sql: crea el esquema "aldore", sus tablas y el contenido inicial.
// Ese archivo se pega una sola vez en Supabase → SQL Editor.  Uso: npm run db:sql
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { services, products, plans, testimonials, faqs } from "./seed-data.mjs";

const tables = execFileSync(
  "npx",
  ["prisma", "migrate", "diff", "--from-empty", "--to-schema-datamodel", "prisma/schema.prisma", "--script"],
  { encoding: "utf8" },
);

const q = (v) =>
  typeof v === "boolean" ? (v ? "true" : "false") : typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`;

const inserts = (table, rows) =>
  rows
    .map((r) => {
      const cols = Object.keys(r);
      return `INSERT INTO "${table}" (${cols.map((c) => `"${c}"`).join(", ")}, "updatedAt") VALUES (${cols.map((c) => q(r[c])).join(", ")}, CURRENT_TIMESTAMP);`;
    })
    .join("\n");

const sql = `-- Aldore · esquema de base de datos para Supabase (PostgreSQL)
-- Pega este archivo completo en Supabase → SQL Editor → Run. Solo se ejecuta una vez.
-- Las tablas quedan en el esquema "aldore", separadas de Castorly y fuera de la API pública de Supabase.

CREATE SCHEMA IF NOT EXISTS aldore;
SET search_path TO aldore;

${tables.replace(/-- CreateSchema\nCREATE SCHEMA IF NOT EXISTS "public";\n\n/, "").trim()}

-- Contenido inicial de ejemplo (editable desde el panel). No crea usuarios:
-- el primer administrador se crea en /admin/login con el SETUP_CODE.
${inserts("Service", services.map((s, i) => ({ ...s, order: i })))}
${inserts("Product", products)}
${inserts("Plan", plans)}
${inserts("Testimonial", testimonials)}
${inserts("Faq", faqs)}

-- Que la API pública de Supabase (anon/authenticated) no pueda leer estas tablas.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON SCHEMA aldore FROM anon, authenticated;
    REVOKE ALL ON ALL TABLES IN SCHEMA aldore FROM anon, authenticated;
  END IF;
END $$;

RESET search_path;
`;

writeFileSync(new URL("../supabase/aldore.sql", import.meta.url), sql);
console.log("✓ supabase/aldore.sql generado");
