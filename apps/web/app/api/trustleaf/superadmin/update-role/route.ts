import { submitSuperAdminRoleUpdate } from "@/app/lib/trustleaf/superAdminRbac";
import { resolveOrigin } from "@/app/lib/walletless/config";
import { readWalletlessSession } from "@/app/lib/walletless/session";

type SuperAdminRoleUpdateBody = {
  admin?: string;
  role?: "DOCTOR" | "DISP" | "LAB" | "CULT";
  account?: string;
  action?: "grant_role" | "revoke_role";
  baseFee?: string;
};

export async function POST(request: Request) {
  const origin = resolveOrigin(request);
  const session = await readWalletlessSession(origin);

  if (!session) {
    return Response.json({ error: "wallet-less session required" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as SuperAdminRoleUpdateBody | null;

  try {
    const result = await submitSuperAdminRoleUpdate(body ?? {}, session.view.username);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unexpected superadmin role update error",
      },
      { status: 409 },
    );
  }
}
