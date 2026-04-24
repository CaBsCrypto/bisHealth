import { verifyFreighterLogin } from "@/app/lib/freighter/service";
import { resolveOrigin } from "@/app/lib/walletless/config";

type FreighterVerifyBody = {
  flowToken?: string;
  address?: string;
  signerAddress?: string;
  signedMessage?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as FreighterVerifyBody | null;
  const flowToken = body?.flowToken;
  const address = body?.address;
  const signerAddress = body?.signerAddress;
  const signedMessage = body?.signedMessage;

  if (!flowToken || !address || !signerAddress || !signedMessage) {
    return Response.json(
      { error: "flowToken, address, signerAddress, and signedMessage are required" },
      { status: 400 },
    );
  }

  try {
    const verification = await verifyFreighterLogin({
      origin: resolveOrigin(request),
      flowToken,
      address,
      signerAddress,
      signedMessage,
    });

    return Response.json(verification);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "freighter challenge expired") {
        return Response.json({ error: error.message }, { status: 409 });
      }

      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ error: "freighter verification failed" }, { status: 400 });
  }
}
