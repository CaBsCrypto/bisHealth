import "server-only";

import { createHash, randomUUID } from "node:crypto";

import { Keypair } from "@stellar/stellar-sdk";

import { getPasskeyProfileRepository } from "@/app/lib/passkeys/repository";
import { getWalletlessConfig } from "@/app/lib/walletless/config";
import { createWalletlessSession } from "@/app/lib/walletless/session";
import { buildWalletlessProfile, toSessionView } from "@/app/lib/walletless/store";
import { signWalletlessToken, verifyWalletlessToken } from "@/app/lib/walletless/tokens";
import type {
  WalletlessProfileRecord,
  WalletlessSessionView,
} from "@/app/lib/walletless/types";

const STELLAR_SIGNED_MESSAGE_PREFIX = "Stellar Signed Message:\n";

type FreighterFlowToken = {
  address: string;
  challenge: string;
  username: string;
  displayName: string;
};

export type PrepareFreighterChallengeArgs = {
  origin: string;
  address: string;
};

export type VerifyFreighterLoginArgs = {
  origin: string;
  flowToken: string;
  address: string;
  signerAddress: string;
  signedMessage: string;
};

export type FreighterChallengeEnvelope = {
  flowToken: string;
  challenge: string;
  address: string;
  username: string;
  displayName: string;
};

export type FreighterVerificationResult = {
  verified: boolean;
  profile: WalletlessProfileRecord;
  session: WalletlessSessionView;
};

export async function prepareFreighterChallenge(
  args: PrepareFreighterChallengeArgs,
): Promise<FreighterChallengeEnvelope> {
  const address = normalizeStellarAddress(args.address);
  const config = getWalletlessConfig(args.origin);
  const profile = buildFreighterProfile(address);
  const challenge = [
    "Trust Leaf Freighter Login",
    `Origin: ${config.origin}`,
    `Address: ${address}`,
    `Network: ${config.networkPassphrase}`,
    `Nonce: ${randomUUID()}`,
    `Issued At: ${new Date().toISOString()}`,
    "",
    "Sign this message to open your Trust Leaf session.",
  ].join("\n");

  return {
    flowToken: signWalletlessToken<FreighterFlowToken>(
      "walletless-freighter-login",
      {
        address,
        challenge,
        username: profile.username,
        displayName: profile.displayName,
      },
      60 * 10,
    ),
    challenge,
    address,
    username: profile.username,
    displayName: profile.displayName,
  };
}

export async function verifyFreighterLogin(
  args: VerifyFreighterLoginArgs,
): Promise<FreighterVerificationResult> {
  const flow = verifyWalletlessToken<FreighterFlowToken>(
    args.flowToken,
    "walletless-freighter-login",
  );
  if (!flow) {
    throw new Error("freighter challenge expired");
  }

  const requestedAddress = normalizeStellarAddress(args.address);
  const signerAddress = normalizeStellarAddress(args.signerAddress);
  if (flow.data.address !== requestedAddress || signerAddress !== requestedAddress) {
    throw new Error("freighter signer address mismatch");
  }

  const signature = parseFreighterSignedMessage(args.signedMessage);
  const messageHash = createHash("sha256")
    .update(`${STELLAR_SIGNED_MESSAGE_PREFIX}${flow.data.challenge}`, "utf8")
    .digest();
  const verified = Keypair.fromPublicKey(requestedAddress).verify(messageHash, signature);

  if (!verified) {
    throw new Error("freighter signature verification failed");
  }

  const repository = getPasskeyProfileRepository();
  const profile = await repository.ensureProfile({
    username: flow.data.username,
    displayName: flow.data.displayName,
    fallbackProfile: buildFreighterProfile(requestedAddress),
  });
  const savedProfile = await repository.saveProfile(profile);
  const config = getWalletlessConfig(args.origin);
  const summary = await createWalletlessSession(savedProfile, config.origin);

  return {
    verified: true,
    profile: savedProfile,
    session: toSessionView(summary, config.sponsorMode, config.networkPassphrase),
  };
}

export function buildFreighterProfile(address: string): WalletlessProfileRecord {
  const normalizedAddress = normalizeStellarAddress(address);

  return buildWalletlessProfile({
    username: `freighter-${normalizedAddress.toLowerCase()}`,
    displayName: `Freighter ${normalizedAddress.slice(0, 4)}...${normalizedAddress.slice(-4)}`,
  });
}

function normalizeStellarAddress(address: string) {
  const normalizedAddress = address.trim();
  Keypair.fromPublicKey(normalizedAddress);
  return normalizedAddress;
}

function parseFreighterSignedMessage(signedMessage: string) {
  const trimmed = signedMessage.trim();
  if (!trimmed) {
    throw new Error("freighter signed message is required");
  }

  try {
    const parsed = JSON.parse(trimmed) as { data?: number[] };
    if (Array.isArray(parsed.data)) {
      return Buffer.from(parsed.data);
    }
  } catch {
    // Fall through to base64 parsing.
  }

  return Buffer.from(trimmed, "base64");
}
