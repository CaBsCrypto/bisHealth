import Link from "next/link";

import { getLocale } from "../lib/locale";
import { DemoPresenterPage } from "./demo-presenter-page";

export default async function DemoScriptPage() {
  const locale = await getLocale();
  return <DemoPresenterPage locale={locale} />;
}
