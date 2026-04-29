import {
  listTrustLeafOnboardingQueue,
  updateTrustLeafOnboardingApplicationStatus,
} from "@/app/lib/trustleaf/onboarding";
import { resolveOrigin } from "@/app/lib/walletless/config";
import { readWalletlessSession } from "@/app/lib/walletless/session";

const statuses = new Set(["draft", "submitted", "approved", "rejected"]);

export async function GET() {
  const queue = await listTrustLeafOnboardingQueue({
    status: "submitted",
  });

  return Response.json(queue);
}

export async function PATCH(request: Request) {
  const origin = resolveOrigin(request);
  const session = await readWalletlessSession(origin);

  if (!session) {
    return Response.json({ ok: false, error: "wallet_less_session_required" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        applicationId?: string;
        status?: string;
      }
    | null;

  const applicationId = String(body?.applicationId ?? "").trim();
  const status = String(body?.status ?? "").trim();

  if (!applicationId) {
    return Response.json({ ok: false, error: "application_id_required" }, { status: 400 });
  }

  if (!statuses.has(status)) {
    return Response.json({ ok: false, error: "invalid_status" }, { status: 400 });
  }

  try {
    const result = await updateTrustLeafOnboardingApplicationStatus({
      applicationId,
      status: status as "draft" | "submitted" | "approved" | "rejected",
    });

    return Response.json({
      ok: true,
      reviewedBy: session.view.username,
      ...result,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "unexpected_onboarding_update_error",
      },
      { status: 409 },
    );
  }
}
