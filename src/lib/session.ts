// Funciones de sesión compatibles con el runtime Edge (usadas por el middleware).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "nb_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas

export function authSecretReady() {
  return (process.env.AUTH_SECRET ?? "").length >= 32;
}

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error("AUTH_SECRET debe estar definido y tener al menos 32 caracteres.");
  }
  return new TextEncoder().encode(s);
}

export type SessionPayload = { uid: number; email: string; name: string };

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());
}

export async function verifySession(token?: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
