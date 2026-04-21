import { getStellarPasskeysConfig } from "@/app/lib/stellar/passkeys";

export async function GET() {
  return Response.json(getStellarPasskeysConfig());
}
