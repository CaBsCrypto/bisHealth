import { getTrustLeafDeployment } from "@/app/lib/trustleaf/deployment";

export async function GET() {
  return Response.json(await getTrustLeafDeployment());
}
