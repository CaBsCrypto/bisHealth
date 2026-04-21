import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

type SignedEnvelope<T> = {
  data: T;
  exp: number;
  kind: string;
  v: 1;
};

export function signWalletlessToken<T>(kind: string, data: T, ttlSeconds: number) {
  const envelope: SignedEnvelope<T> = {
    v: 1,
    kind,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    data,
  };

  const payload = Buffer.from(JSON.stringify(envelope), "utf8").toString("base64url");
  const signature = createHmac("sha256", getWalletlessSigningSecret()).update(payload).digest("base64url");

  return `${payload}.${signature}`;
}

export function verifyWalletlessToken<T>(token: string, expectedKind: string): SignedEnvelope<T> | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", getWalletlessSigningSecret())
    .update(payload)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const envelope = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as SignedEnvelope<T>;

    if (envelope.v !== 1 || envelope.kind !== expectedKind) {
      return null;
    }

    if (envelope.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return envelope;
  } catch {
    return null;
  }
}

export function deriveWalletlessUserId(username: string) {
  return `tl-user-${createHash("sha256").update(normalizeUsername(username)).digest("hex").slice(0, 24)}`;
}

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function getWalletlessSigningSecret() {
  return (
    process.env.TRUST_LEAF_SESSION_SECRET ??
    process.env.TRUST_LEAF_SPONSOR_SECRET_KEY ??
    process.env.TRUST_LEAF_RP_ID ??
    "trust-leaf-demo-secret"
  );
}
