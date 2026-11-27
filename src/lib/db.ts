import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SCHEMA_GUARD } from "./schema-guard";

/**
 * Cliente de base de datos.
 * - En Cloudflare Workers usa D1 (binding "DB") con el adaptador de Prisma.
 * - En Node (local, Docker, VPS) usa DATABASE_URL (SQLite o PostgreSQL).
 */

const isWorker = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const d1Clients = new WeakMap<object, PrismaClient>();

function nodeClient() {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient();
  return globalForPrisma.prisma;
}

type D1Like = { prepare(sql: string): unknown; batch(stmts: unknown[]): Promise<unknown> };

/** Crea (si faltan) las tablas más recientes. Así el sitio no se cae si las migraciones no se aplicaron. */
function ensureSchema(db: D1Like) {
  return db.batch(SCHEMA_GUARD.map((s) => db.prepare(s))).catch((e) => {
    console.error("No se pudo verificar el esquema de D1", e);
  });
}

function workerClient(): PrismaClient {
  const env = getCloudflareContext().env as unknown as { DB: D1Like };
  let client = d1Clients.get(env.DB);
  if (!client) {
    const ready = ensureSchema(env.DB);
    client = new PrismaClient({ adapter: new PrismaD1(env.DB as never) }).$extends({
      query: {
        async $allOperations({ args, query }) {
          await ready;
          return query(args);
        },
      },
    }) as unknown as PrismaClient;
    d1Clients.set(env.DB, client);
  }
  return client;
}

export function getPrisma(): PrismaClient {
  return isWorker ? workerClient() : nodeClient();
}

/** Acceso perezoso: resuelve el cliente correcto en cada uso. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_t, prop) {
    const client = getPrisma() as unknown as Record<string | symbol, unknown>;
    const value = client[prop];
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(client) : value;
  },
});
