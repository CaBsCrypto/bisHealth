import {
  listTrustLeafOnboardingQueue,
  submitTrustLeafOnboardingApplication,
} from "@/app/lib/trustleaf/onboarding";

const actorTypes = new Set(["patient", "doctor", "dispensary", "growshop"]);
const statuses = new Set(["draft", "submitted", "approved", "rejected"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const actorType = searchParams.get("actorType");
  const status = searchParams.get("status");

  const queue = await listTrustLeafOnboardingQueue({
    actorType: actorTypes.has(actorType ?? "") ? (actorType as never) : undefined,
    status: statuses.has(status ?? "") ? (status as never) : undefined,
  });

  return Response.json(queue);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;

  if (!actorTypes.has(String(body.actorType ?? ""))) {
    return Response.json(
      {
        ok: false,
        error: "invalid_actor_type",
      },
      { status: 400 },
    );
  }

  const fullName = String(body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim();

  if (!fullName || !email) {
    return Response.json(
      {
        ok: false,
        error: "full_name_and_email_required",
      },
      { status: 400 },
    );
  }

  const result = await submitTrustLeafOnboardingApplication({
    actorType: body.actorType as never,
    fullName,
    email,
    organizationName: typeof body.organizationName === "string" ? body.organizationName : null,
    country: typeof body.country === "string" ? body.country : null,
    walletAddress: typeof body.walletAddress === "string" ? body.walletAddress : null,
    notes: typeof body.notes === "string" ? body.notes : null,
    source: typeof body.source === "string" ? body.source : "public-landing",
  });

  return Response.json({
    ok: true,
    ...result,
  });
}
