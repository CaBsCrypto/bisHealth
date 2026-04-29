import { listTrustLeafOnboardingQueue } from "@/app/lib/trustleaf/onboarding";

export async function GET() {
  const queue = await listTrustLeafOnboardingQueue({
    status: "submitted",
  });

  return Response.json(queue);
}
