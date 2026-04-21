import { getTrustLeafZkFixture } from "@/app/lib/trustleaf/zkFixture";

export async function GET() {
  return Response.json(await getTrustLeafZkFixture());
}
