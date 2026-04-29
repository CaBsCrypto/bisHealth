import { getLocale } from "../lib/locale";
import { getIndexedState } from "../lib/trustleaf/indexedState";
import { getTrustLeafDeployment } from "../lib/trustleaf/deployment";
import { getTrustLeafLiveReadiness } from "../lib/trustleaf/liveReadiness";
import { AdminHubRedesign } from "./admin-hub-redesign";

export default async function AdminPage() {
  const locale = await getLocale();
  const indexedState = await getIndexedState();
  const deployment = await getTrustLeafDeployment();
  const liveReadiness = getTrustLeafLiveReadiness();

  return (
    <AdminHubRedesign
      locale={locale}
      indexedState={indexedState}
      deployment={deployment}
      liveReadiness={liveReadiness}
    />
  );
}
