import { cookies } from "next/headers";

import { getWalletlessConfig } from "./config";
import {
  WALLETLESS_SESSION_COOKIE,
  clearSession,
  createSession,
  getSession,
  touchSession,
  toSessionView,
} from "./store";

export type WalletlessResolvedSession = {
  sessionId: string;
  userId: string;
  view: ReturnType<typeof toSessionView>;
};

export async function readWalletlessSession(origin: string): Promise<WalletlessResolvedSession | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(WALLETLESS_SESSION_COOKIE)?.value;

  if (!sessionId) {
    return null;
  }

  const session = touchSession(sessionId);
  if (!session) {
    cookieStore.delete(WALLETLESS_SESSION_COOKIE);
    return null;
  }

  const config = getWalletlessConfig(origin);

  return {
    sessionId: session.id,
    userId: session.userId,
    view: toSessionView(session.userId, config.sponsorMode, config.networkPassphrase),
  };
}

export async function createWalletlessSession(userId: string, origin: string) {
  const cookieStore = await cookies();
  const session = createSession(userId);
  const secure = new URL(origin).protocol === "https:";

  cookieStore.set(WALLETLESS_SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return session;
}

export async function clearWalletlessSessionCookie() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(WALLETLESS_SESSION_COOKIE)?.value;

  if (sessionId && getSession(sessionId)) {
    clearSession(sessionId);
  }

  cookieStore.delete(WALLETLESS_SESSION_COOKIE);
}
