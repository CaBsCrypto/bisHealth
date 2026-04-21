import { createHash } from "node:crypto";

import type {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
  WebAuthnCredential,
} from "@simplewebauthn/server";

import { deriveWalletlessUserId, normalizeUsername } from "./tokens";
import type {
  SponsorMode,
  WalletlessCredentialRecord,
  WalletlessProfileRecord,
  WalletlessProfileSummary,
  WalletlessSessionView,
} from "./types";

export const WALLETLESS_SESSION_COOKIE = "trustleaf_walletless_session";

export function buildWalletlessProfile(args: {
  username: string;
  displayName?: string;
  profile?: WalletlessProfileRecord | null;
}) {
  const username = normalizeUsername(args.username);
  const existingProfile =
    args.profile && normalizeUsername(args.profile.username) === username ? sanitizeProfile(args.profile) : null;
  const displayName = args.displayName?.trim() || existingProfile?.displayName || args.username.trim();

  return {
    userId: deriveWalletlessUserId(username),
    username,
    displayName,
    createdAt: existingProfile?.createdAt ?? new Date().toISOString(),
    credentials: existingProfile?.credentials ?? [],
  } satisfies WalletlessProfileRecord;
}

export function sanitizeProfile(profile: WalletlessProfileRecord) {
  const username = normalizeUsername(profile.username);
  const credentials = Array.isArray(profile.credentials)
    ? profile.credentials.reduce<WalletlessCredentialRecord[]>((list, credential) => {
        const sanitized = sanitizeCredential(credential);
        if (sanitized) {
          list.push(sanitized);
        }
        return list;
      }, [])
    : [];

  return {
    userId: deriveWalletlessUserId(username),
    username,
    displayName: profile.displayName.trim() || profile.username.trim(),
    createdAt: profile.createdAt || new Date().toISOString(),
    credentials,
  } satisfies WalletlessProfileRecord;
}

export function toProfileSummary(profile: WalletlessProfileRecord): WalletlessProfileSummary {
  return {
    userId: profile.userId,
    username: profile.username,
    displayName: profile.displayName,
    credentialCount: profile.credentials.length,
  };
}

export function listCredentialDescriptors(credentials: WalletlessCredentialRecord[]) {
  return credentials.map((credential) => ({
    id: credential.id,
    type: "public-key" as const,
    transports: credential.transports as AuthenticatorTransportFuture[] | undefined,
  }));
}

export function getCredential(profile: WalletlessProfileRecord, credentialId: string) {
  return profile.credentials.find((credential) => credential.id === credentialId) ?? null;
}

export function toWebAuthnCredential(credential: WalletlessCredentialRecord): WebAuthnCredential {
  return {
    id: credential.id,
    publicKey: Buffer.from(credential.publicKey, "base64url"),
    counter: credential.counter,
    transports: credential.transports as AuthenticatorTransportFuture[] | undefined,
  };
}

export function addCredential(args: {
  profile: WalletlessProfileRecord;
  credential: WebAuthnCredential;
  deviceType: CredentialDeviceType;
  backedUp: boolean;
  transports?: AuthenticatorTransportFuture[];
}) {
  const nextCredentials = [...args.profile.credentials];
  const existingIndex = nextCredentials.findIndex((credential) => credential.id === args.credential.id);
  const nextCredential: WalletlessCredentialRecord = {
    id: args.credential.id,
    publicKey: Buffer.from(args.credential.publicKey).toString("base64url"),
    counter: args.credential.counter,
    transports: args.transports,
    deviceType: args.deviceType,
    backedUp: args.backedUp,
    createdAt:
      existingIndex >= 0
        ? nextCredentials[existingIndex]?.createdAt ?? new Date().toISOString()
        : new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    nextCredentials[existingIndex] = nextCredential;
  } else {
    nextCredentials.push(nextCredential);
  }

  return {
    profile: {
      ...args.profile,
      credentials: nextCredentials,
    },
    credential: nextCredential,
  };
}

export function updateCredentialCounter(
  profile: WalletlessProfileRecord,
  credentialId: string,
  counter: number,
) {
  let found = false;
  const credentials = profile.credentials.map((credential) => {
    if (credential.id !== credentialId) {
      return credential;
    }

    found = true;
    return {
      ...credential,
      counter,
    };
  });

  if (!found) {
    throw new Error("Wallet-less credential not found");
  }

  return {
    ...profile,
    credentials,
  };
}

export function toSessionView(
  profile: WalletlessProfileSummary,
  sponsorMode: SponsorMode,
  networkPassphrase: string,
): WalletlessSessionView {
  const smartWalletHint = `tl-wallet-${createHash("sha256").update(profile.userId).digest("hex").slice(0, 12)}`;

  return {
    userId: profile.userId,
    username: profile.username,
    displayName: profile.displayName,
    sponsorMode,
    smartWalletStatus: profile.credentialCount > 0 ? "deployment-ready" : "not-enrolled",
    smartWalletHint,
    credentialCount: profile.credentialCount,
    networkPassphrase,
  };
}

function sanitizeCredential(record: WalletlessCredentialRecord | null | undefined): WalletlessCredentialRecord | null {
  if (!record?.id || !record.publicKey) {
    return null;
  }

  return {
    id: record.id,
    publicKey: record.publicKey,
    counter: Number.isFinite(record.counter) ? record.counter : 0,
    transports: Array.isArray(record.transports)
      ? record.transports.filter((value): value is string => typeof value === "string")
      : undefined,
    deviceType: record.deviceType === "singleDevice" ? "singleDevice" : "multiDevice",
    backedUp: record.backedUp === true,
    createdAt: record.createdAt || new Date().toISOString(),
  };
}
