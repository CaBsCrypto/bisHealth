import { getDefindexConfig } from "@/app/lib/defindex/config";

export async function GET() {
  return Response.json(getDefindexConfig());
}
