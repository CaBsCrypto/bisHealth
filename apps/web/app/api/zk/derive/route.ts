import {
  deriveTrustLeafZkFixture,
  type TrustLeafZkCircuitInput,
} from "@/app/lib/trustleaf/zkFixture";

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => null)) as
      | {
          circuitInput?: Partial<TrustLeafZkCircuitInput>;
          proofHex?: string;
        }
      | null;

    return Response.json(
      await deriveTrustLeafZkFixture({
        circuitInput: sanitizeCircuitInput(payload?.circuitInput),
        proofHex: typeof payload?.proofHex === "string" ? payload.proofHex : undefined,
      }),
    );
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unable to derive ZK preview",
      },
      {
        status: 400,
      },
    );
  }
}

function sanitizeCircuitInput(input?: Partial<TrustLeafZkCircuitInput>) {
  if (!input) {
    return undefined;
  }

  const result: Partial<TrustLeafZkCircuitInput> = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string") {
      result[key as keyof TrustLeafZkCircuitInput] = value.trim();
    }
  }

  return result;
}
