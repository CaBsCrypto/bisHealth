import type { RegistrationResponseJSON } from "@simplewebauthn/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";

import { getWalletlessConfig, resolveOrigin } from "@/app/lib/walletless/config";
import { createWalletlessSession } from "@/app/lib/walletless/session";
import {
  addCredential,
  buildWalletlessProfile,
  toSessionView,
  toProfileSummary,
} from "@/app/lib/walletless/store";
import { verifyWalletlessToken } from "@/app/lib/walletless/tokens";
import type { WalletlessProfileRecord } from "@/app/lib/walletless/types";

type RegisterVerifyBody = {
  flowToken?: string;
  response?: RegistrationResponseJSON;
  profile?: WalletlessProfileRecord | null;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RegisterVerifyBody | null;
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
  }>(flowToken, "walletless-register");
  if (!flow) {
    return Response.json({ error: "registration challenge expired" }, { status: 409 });
  }

  const profile = buildWalletlessProfile({
    username: flow.data.username,
    displayName: flow.data.displayName,
    profile: body?.profile,
  });
  const config = getWalletlessConfig(resolveOrigin(request));
  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge: flow.data.challenge,
    expectedOrigin: config.origin,
    expectedRPID: config.rpId,
    requireUserVerification: true,
  });

  if (!verification.verified || !verification.registrationInfo) {
    return Response.json({ verified: false }, { status: 400 });
  }

  const { profile: nextProfile } = addCredential({
    profile,
    credential: verification.registrationInfo.credential,
    deviceType: verification.registrationInfo.credentialDeviceType,
    backedUp: verification.registrationInfo.credentialBackedUp,
    transports: response.response.transports,
  });

  const summary = await createWalletlessSession(nextProfile, config.origin);

  return Response.json({
    verified: true,
    profile: nextProfile,
    session: toSessionView(summary, config.sponsorMode, config.networkPassphrase),
  });
}
