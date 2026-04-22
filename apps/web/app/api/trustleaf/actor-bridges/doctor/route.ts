import { getIndexedState } from "@/app/lib/trustleaf/indexedState";
import { getTrustLeafDoctorActionPack } from "@/app/lib/trustleaf/actionRails";

export async function GET() {
  const indexedState = await getIndexedState();
  const doctorMembership =
    indexedState.roleMemberships.find(
      (membership) => membership.isActive && membership.role.includes("DOCTOR"),
    ) ?? null;

  return Response.json(
    await getTrustLeafDoctorActionPack(doctorMembership?.account ?? null),
  );
}
