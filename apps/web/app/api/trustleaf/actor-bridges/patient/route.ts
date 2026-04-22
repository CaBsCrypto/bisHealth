import { getTrustLeafPatientActionPack } from "@/app/lib/trustleaf/actionRails";

export async function GET() {
  return Response.json(await getTrustLeafPatientActionPack());
}
