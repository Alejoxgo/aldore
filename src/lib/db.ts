import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Cliente de base de datos (PostgreSQL / Supabase).
 * - En Node (local, Docker, VPS) usa el motor normal de Prisma con DATABASE_URL.
 * - En Cloudflare Workers usa el adaptador "pg" y crea un cliente por petición,
 *   porque Workers no permite compartir conexiones entre peticiones.
 */

const isWorker = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const perRequest = new WeakMap<object, PrismaClient>();

function nodeClient() {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient();
  return globalForPrisma.prisma;
}

/** Separa el parámetro ?schema= (propio de Prisma) de la URL de conexión. */
export function parseDatabaseUrl(raw: string) {
  const url = new URL(raw);
  const schema = url.searchParams.get("schema") || "public";
  url.searchParams.delete("schema");
  return { connectionString: url.toString(), schema };
}

function workerClient(): PrismaClient {
  const { env, ctx } = getCloudflareContext();
  const key = ctx as unknown as object;
  let client = perRequest.get(key);
  if (!client) {
    const raw = (env as unknown as Record<string, string | undefined>).DATABASE_URL ?? process.env.DATABASE_URL;
    if (!raw) throw new Error("Falta la variable secreta DATABASE_URL.");
    const { connectionString, schema } = parseDatabaseUrl(raw);
    client = new PrismaClient({ adapter: new PrismaPg({ connectionString, max: 1 }, { schema }) });
    perRequest.set(key, client);
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
