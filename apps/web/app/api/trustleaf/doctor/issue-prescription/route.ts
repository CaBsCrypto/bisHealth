import { submitDoctorIssuePrescription } from "@/app/lib/trustleaf/doctorIssue";
import { readWalletlessSession } from "@/app/lib/walletless/session";
import { resolveOrigin } from "@/app/lib/walletless/config";

type DoctorIssueBody = {
  doctor?: string;
  commitment?: string;
  patientNullifier?: string;
  policyHash?: string;
  baseFee?: string;
};

export async function POST(request: Request) {
  const origin = resolveOrigin(request);
  const session = await readWalletlessSession(origin);

  if (!session) {
    return Response.json({ error: "wallet-less session required" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as DoctorIssueBody | null;

  try {
    const result = await submitDoctorIssuePrescription(body ?? {}, session.view.username);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unexpected doctor issue error",
      },
      { status: 409 },
    );
  }
}
