import { createHash, randomUUID } from "node:crypto";

import type {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
  WebAuthnCredential,
} from "@simplewebauthn/server";

import type { SponsorMode, WalletlessSessionView } from "./types";

export const WALLETLESS_SESSION_COOKIE = "trustleaf_walletless_session";

export type StoredCredential = WebAuthnCredential & {
  deviceType: CredentialDeviceType;
  backedUp: boolean;
  createdAt: string;
};

type UserRecord = {
  id: string;
  username: string;
  displayName: string;
  createdAt: string;
  credentials: StoredCredential[];
};

type PendingChallenge = {
  type: "registration" | "authentication";
  challenge: string;
  createdAt: number;
};

type SessionRecord = {
  id: string;
  userId: string;
  createdAt: number;
  lastSeenAt: number;
};

const usersById = new Map<string, UserRecord>();
const userIdsByUsername = new Map<string, string>();
const pendingChallenges = new Map<string, PendingChallenge>();
const sessions = new Map<string, SessionRecord>();

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function findOrCreateUser(username: string, displayName?: string) {
  const normalizedUsername = normalizeUsername(username);
  const existingId = userIdsByUsername.get(normalizedUsername);

  if (existingId) {
    const existingUser = usersById.get(existingId);
    if (!existingUser) {
      throw new Error("Wallet-less user index is inconsistent");
    }

    if (displayName?.trim()) {
      existingUser.displayName = displayName.trim();
    }

    return existingUser;
  }

  const now = new Date().toISOString();
  const user: UserRecord = {
    id: randomUUID(),
    username: normalizedUsername,
    displayName: displayName?.trim() || username.trim(),
    createdAt: now,
    credentials: [],
  };

  usersById.set(user.id, user);
  userIdsByUsername.set(user.username, user.id);

  return user;
}

export function getUserById(userId: string) {
  return usersById.get(userId) ?? null;
}

export function getUserByUsername(username: string) {
  const userId = userIdsByUsername.get(normalizeUsername(username));
  if (!userId) {
    return null;
  }

  return getUserById(userId);
}

export function setPendingChallenge(
  userId: string,
  type: PendingChallenge["type"],
  challenge: string,
) {
  pendingChallenges.set(userId, {
    type,
    challenge,
    createdAt: Date.now(),
  });
}

export function consumePendingChallenge(userId: string, type: PendingChallenge["type"]) {
  const pending = pendingChallenges.get(userId);

  if (!pending || pending.type !== type) {
    return null;
  }

  pendingChallenges.delete(userId);
  return pending.challenge;
}

export function listCredentialDescriptors(userId: string) {
  const user = getUserById(userId);
  if (!user) {
    return [];
  }

  return user.credentials.map((credential) => ({
    id: credential.id,
    type: "public-key" as const,
    transports: credential.transports,
  }));
}

export function getCredential(userId: string, credentialId: string) {
  const user = getUserById(userId);
  if (!user) {
    return null;
  }

  return user.credentials.find((credential) => credential.id === credentialId) ?? null;
}

export function addCredential(args: {
  userId: string;
  credential: WebAuthnCredential;
  deviceType: CredentialDeviceType;
  backedUp: boolean;
  transports?: AuthenticatorTransportFuture[];
}) {
  const user = getUserById(args.userId);
  if (!user) {
    throw new Error("Wallet-less user not found");
  }

  const existing = getCredential(args.userId, args.credential.id);
  if (existing) {
    existing.counter = args.credential.counter;
    existing.publicKey = args.credential.publicKey;
    existing.transports = args.transports;
    existing.deviceType = args.deviceType;
    existing.backedUp = args.backedUp;
    return existing;
  }

  const storedCredential: StoredCredential = {
    id: args.credential.id,
    publicKey: args.credential.publicKey,
    counter: args.credential.counter,
    transports: args.transports,
    deviceType: args.deviceType,
    backedUp: args.backedUp,
    createdAt: new Date().toISOString(),
  };

  user.credentials.push(storedCredential);
  return storedCredential;
}

export function updateCredentialCounter(userId: string, credentialId: string, counter: number) {
  const credential = getCredential(userId, credentialId);
  if (!credential) {
    throw new Error("Wallet-less credential not found");
  }

  credential.counter = counter;
  return credential;
}

export function createSession(userId: string) {
  const session: SessionRecord = {
    id: randomUUID(),
    userId,
    createdAt: Date.now(),
    lastSeenAt: Date.now(),
  };

  sessions.set(session.id, session);
  return session;
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId) ?? null;
}

export function touchSession(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) {
    return null;
  }

  session.lastSeenAt = Date.now();
  return session;
}

export function clearSession(sessionId: string) {
  sessions.delete(sessionId);
}

export function toSessionView(
  userId: string,
  sponsorMode: SponsorMode,
  networkPassphrase: string,
): WalletlessSessionView {
  const user = getUserById(userId);
  if (!user) {
    throw new Error("Wallet-less user not found");
  }

  const hasCredentials = user.credentials.length > 0;
  const smartWalletHint = `tl-wallet-${createHash("sha256").update(userId).digest("hex").slice(0, 12)}`;

  return {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    sponsorMode,
    smartWalletStatus: hasCredentials ? "deployment-ready" : "not-enrolled",
    smartWalletHint,
    credentialCount: user.credentials.length,
    networkPassphrase,
  };
}
