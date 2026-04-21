import type { AuthenticationResponseJSON } from "@simplewebauthn/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";

import { getWalletlessConfig, resolveOrigin } from "@/app/lib/walletless/config";
import { createWalletlessSession } from "@/app/lib/walletless/session";
import {
  buildWalletlessProfile,
  getCredential,
  toSessionView,
  toWebAuthnCredential,
  updateCredentialCounter,
} from "@/app/lib/walletless/store";
import { verifyWalletlessToken } from "@/app/lib/walletless/tokens";
import type { WalletlessProfileRecord } from "@/app/lib/walletless/types";

type LoginVerifyBody = {
  flowToken?: string;
  response?: AuthenticationResponseJSON;
  profile?: WalletlessProfileRecord | null;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginVerifyBody | null;
  const flowToken = body?.flowToken;
  const response = body?.response;

  if (!flowToken || !response) {
    return Response.json({ error: "flowToken and response are required" }, { status: 400 });
  }

  const flow = verifyWalletlessToken<{
    userId: string;
    username: string;
    displayName: string;
    challenge: string;
  }>(flowToken, "walletless-login");
  if (!flow) {
    return Response.json({ error: "authentication challenge expired" }, { status: 409 });
  }

  const profile = buildWalletlessProfile({
    username: flow.data.username,
    displayName: flow.data.displayName,
    profile: body?.profile,
  });
  const credential = getCredential(profile, response.id);
  if (!credential) {
    return Response.json({ error: "credential not registered" }, { status: 404 });
  }

  const config = getWalletlessConfig(resolveOrigin(request));
  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: flow.data.challenge,
    expectedOrigin: config.origin,
    expectedRPID: config.rpId,
    credential: toWebAuthnCredential(credential),
    requireUserVerification: true,
  });

  if (!verification.verified) {
    return Response.json({ verified: false }, { status: 400 });
  }

  const nextProfile = updateCredentialCounter(
    profile,
    credential.id,
    verification.authenticationInfo.newCounter,
  );
  const summary = await createWalletlessSession(nextProfile, config.origin);

  return Response.json({
    verified: true,
    profile: nextProfile,
    session: toSessionView(summary, config.sponsorMode, config.networkPassphrase),
  });
}
