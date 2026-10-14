import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/*
  Lightweight session auth for the dashboard only. The public site never
  touches this. Accounts live in an env var rather than a users table so the
  client can add or remove team logins without a migration:

    JUBILEE_TEAM_ACCOUNTS="asha@jubileesales.in:pw1,ravi@jubileesales.in:pw2"

  Swapping this for NextAuth later means replacing getSession/requireSession
  and the two server actions in app/login — nothing else reads the cookie.
*/

const COOKIE = "jubilee_session";
const MAX_AGE_SECONDS = 60 * 60 * 12;

// Used only when no accounts are configured AND we are not in production.
const DEV_ACCOUNT = { email: "admin@jubileesales.in", password: "jubilee-dev" };

export type Session = { email: string; expires: number };

function secret(): string {
  const s = process.env.JUBILEE_SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JUBILEE_SESSION_SECRET must be set in production");
  }
  return "dev-only-insecure-session-secret";
}

function accounts(): { email: string; password: string }[] {
  const raw = process.env.JUBILEE_TEAM_ACCOUNTS?.trim();
  if (!raw) {
    return process.env.NODE_ENV === "production" ? [] : [DEV_ACCOUNT];
  }
  return raw
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const at = pair.indexOf(":");
      return { email: pair.slice(0, at).trim().toLowerCase(), password: pair.slice(at + 1) };
    })
    .filter((a) => a.email && a.password);
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function verifyCredentials(email: string, password: string): boolean {
  const list = accounts();
  const match = list.find((a) => a.email === email.trim().toLowerCase());
  // Always run a comparison so a wrong email and a wrong password take the
  // same amount of time.
  const expected = match?.password ?? crypto.randomBytes(24).toString("hex");
  const ok = safeEqual(password, expected);
  return Boolean(match) && ok;
}

export async function createSession(email: string): Promise<void> {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = Buffer.from(JSON.stringify({ email, expires })).toString("base64url");
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;

  const dot = raw.lastIndexOf(".");
  if (dot < 1) return null;

  const payload = raw.slice(0, dot);
  const signature = raw.slice(dot + 1);
  if (!safeEqual(signature, sign(payload))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    if (!session.email || session.expires < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

/** Use at the top of every dashboard page and every mutating server action. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export function hasConfiguredAccounts(): boolean {
  return accounts().length > 0;
}

export function usingDevAccount(): boolean {
  return !process.env.JUBILEE_TEAM_ACCOUNTS?.trim() && process.env.NODE_ENV !== "production";
}

export const DEV_ACCOUNT_HINT = DEV_ACCOUNT;
