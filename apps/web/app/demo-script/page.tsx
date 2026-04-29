import Link from "next/link";

import { getLocale } from "../lib/locale";
import { DemoMinimalPage } from "./demo-minimal-page";

export default async function DemoScriptPage() {
  const locale = await getLocale();
  return <DemoMinimalPage locale={locale} />;
}
