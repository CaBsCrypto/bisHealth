import { resolveOrigin } from "@/app/lib/walletless/config";
import {
  clearWalletlessSessionCookie,
  readWalletlessSession,
} from "@/app/lib/walletless/session";

export async function GET(request: Request) {
  const session = await readWalletlessSession(resolveOrigin(request));

  return Response.json({
    authenticated: Boolean(session),
    session: session?.view ?? null,
  });
}

export async function DELETE() {
  await clearWalletlessSessionCookie();
  return Response.json({ cleared: true });
}
