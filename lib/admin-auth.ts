import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "selixa_admin";
const COOKIE_PATH = "/admin";
const SESSION_DAYS = 7;
const DEFAULT_USERNAME = "admin";

/** The expected username — ADMIN_USERNAME, or "admin" when it isn't set. */
export function adminUsername(): string {
  return process.env.ADMIN_USERNAME?.trim() || DEFAULT_USERNAME;
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function sessionKey(): string | null {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  // Username is part of the derived key, so changing either credential ends existing sessions.
  return password ? createHash("sha256").update(`selixa-admin:${adminUsername()}:${password}`).digest("hex") : null;
}

const sha = (s: string) => createHash("sha256").update(s).digest();
const sign = (payload: string, key: string) => createHmac("sha256", key).update(payload).digest("base64url");

/** Constant-time check against ADMIN_USERNAME / ADMIN_PASSWORD. Username is case-insensitive. */
export function verifyAdminCredentials(username: string, password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Both compared unconditionally so a wrong username costs the same as a wrong password.
  const userOk = timingSafeEqual(sha(username.trim().toLowerCase()), sha(adminUsername().toLowerCase()));
  const passOk = timingSafeEqual(sha(password), sha(expected));
  return userOk && passOk;
}

export async function createAdminSession(): Promise<void> {
  const key = sessionKey();
  if (!key) return;
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(expires);
  const store = await cookies();
  store.set(COOKIE, `${payload}.${sign(payload, key)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: COOKIE_PATH,
    expires: new Date(expires),
  });
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete({ name: COOKIE, path: COOKIE_PATH });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const key = sessionKey();
  if (!key) return false;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return false;
  if (Number(payload) < Date.now()) return false;
  const expected = sign(payload, key);
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}
