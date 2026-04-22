import { getIndexedState } from "@/app/lib/trustleaf/indexedState";
import { getTrustLeafDispensaryActionPack } from "@/app/lib/trustleaf/actionRails";

export async function GET() {
  const indexedState = await getIndexedState();
  const dispensaryMembership =
    indexedState.roleMemberships.find(
      (membership) => membership.isActive && membership.role.includes("DISP"),
    ) ?? null;

  return Response.json(
    await getTrustLeafDispensaryActionPack(dispensaryMembership?.account ?? null),
  );
}
