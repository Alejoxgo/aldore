import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

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

function workerClient(): PrismaClient {
  const env = getCloudflareContext().env as unknown as { DB: object };
  let client = d1Clients.get(env.DB);
  if (!client) {
    client = new PrismaClient({ adapter: new PrismaD1(env.DB as never) });
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
