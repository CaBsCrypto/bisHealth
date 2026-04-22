import type { RegistrationResponseJSON } from "@simplewebauthn/server";

import { verifyPasskeyRegistration } from "@/app/lib/passkeys/service";
import { resolveOrigin } from "@/app/lib/walletless/config";
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

  try {
    const verification = await verifyPasskeyRegistration({
      origin: resolveOrigin(request),
      flowToken,
      response,
      profile: body?.profile,
    });

    return Response.json(verification);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "registration challenge expired") {
        return Response.json({ error: error.message }, { status: 409 });
      }

      if (error.message === "registration verification failed") {
        return Response.json({ verified: false }, { status: 400 });
      }

      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ error: "registration verification failed" }, { status: 400 });
  }
}
