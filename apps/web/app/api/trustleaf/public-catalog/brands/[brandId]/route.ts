import type { Locale } from "@/app/lib/i18n";
import { getTrustLeafPublicBrandDetail } from "@/app/lib/trustleaf/publicCatalog";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      brandId: string;
    }>;
  },
) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") === "es" ? "es" : "en";
  const { brandId } = await context.params;

  const brand = await getTrustLeafPublicBrandDetail(brandId, locale as Locale);

  if (!brand) {
    return Response.json(
      {
        ok: false,
        error: "brand_not_found",
      },
      { status: 404 },
    );
  }

  return Response.json({
    ok: true,
    locale,
    brand,
  });
}
