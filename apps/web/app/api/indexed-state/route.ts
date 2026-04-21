import { getIndexedState } from "../../lib/trustleaf/indexedState";

export async function GET() {
  return Response.json(await getIndexedState());
}
