import type { Locale } from "@/app/lib/i18n";
import { getTrustLeafPublicProductDetail } from "@/app/lib/trustleaf/publicCatalog";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      productId: string;
    }>;
  },
) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") === "es" ? "es" : "en";
  const { productId } = await context.params;

  const product = await getTrustLeafPublicProductDetail(productId, locale as Locale);

  if (!product) {
    return Response.json(
      {
        ok: false,
        error: "product_not_found",
      },
      { status: 404 },
    );
  }

  return Response.json({
    ok: true,
    locale,
    product,
  });
}
