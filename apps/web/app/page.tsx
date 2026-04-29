import { HomePublic } from "./home-public";
import { getMarketingData } from "./lib/i18n";
import { getLocale } from "./lib/locale";
import { getIndexedState } from "./lib/trustleaf/indexedState";

export default async function HomePage() {
  const locale = await getLocale();
  const marketing = getMarketingData(locale);
  const indexedState = await getIndexedState();

  return <HomePublic locale={locale} marketing={marketing} indexedState={indexedState} />;
}
