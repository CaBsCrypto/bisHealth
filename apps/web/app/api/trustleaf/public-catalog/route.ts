import { isLocale, type Locale } from "@/app/lib/i18n";
import { getTrustLeafPublicCatalog } from "@/app/lib/trustleaf/publicCatalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedLocale = searchParams.get("locale");
  const locale: Locale = isLocale(requestedLocale) ? requestedLocale : "en";

  return Response.json(await getTrustLeafPublicCatalog(locale));
}
