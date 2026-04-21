import { cookies } from "next/headers";

import { getWalletlessConfig } from "./config";
import {
  WALLETLESS_SESSION_COOKIE,
  toProfileSummary,
  toSessionView,
} from "./store";
import { signWalletlessToken, verifyWalletlessToken } from "./tokens";
import type { WalletlessProfileRecord, WalletlessProfileSummary } from "./types";

export type WalletlessResolvedSession = {
  userId: string;
  view: ReturnType<typeof toSessionView>;
};

export async function readWalletlessSession(origin: string): Promise<WalletlessResolvedSession | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(WALLETLESS_SESSION_COOKIE)?.value;

  if (!sessionToken) {
    return null;
  }

  const session = verifyWalletlessToken<WalletlessProfileSummary>(sessionToken, "walletless-session");
  if (!session) {
    cookieStore.delete(WALLETLESS_SESSION_COOKIE);
    return null;
  }

  const config = getWalletlessConfig(origin);

  return {
    userId: session.data.userId,
    view: toSessionView(session.data, config.sponsorMode, config.networkPassphrase),
  };
}

export async function createWalletlessSession(profile: WalletlessProfileRecord, origin: string) {
  const cookieStore = await cookies();
  const secure = new URL(origin).protocol === "https:";
  const summary = toProfileSummary(profile);
  const sessionToken = signWalletlessToken("walletless-session", summary, 60 * 60 * 12);

  cookieStore.set(WALLETLESS_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return summary;
}

export async function clearWalletlessSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(WALLETLESS_SESSION_COOKIE);
}
