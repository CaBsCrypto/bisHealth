import { HomePublicNext } from "./home-public-next";
import { getMarketingData } from "./lib/i18n";
import { getLocale } from "./lib/locale";
import { getTrustLeafPublicCatalog } from "./lib/trustleaf/publicCatalog";

export default async function HomePage() {
  const locale = await getLocale();
  const marketing = getMarketingData(locale);
  const catalog = await getTrustLeafPublicCatalog(locale);

  return <HomePublicNext locale={locale} marketing={marketing} catalog={catalog} />;
}
