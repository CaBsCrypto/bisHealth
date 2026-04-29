import { getTrustLeafActivityLog } from "@/app/lib/trustleaf/activityLog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "12");

  return Response.json({
    items: await getTrustLeafActivityLog(Number.isFinite(limit) ? limit : 12),
  });
}
