import Link from "next/link";

import { LanguageSwitcher } from "../language-switcher";
import { getWalletlessPageCopy } from "../lib/i18n";
import { getLocale } from "../lib/locale";
import { WalletlessWorkbench } from "./walletless-workbench";

export default async function WalletlessPage() {
  const locale = await getLocale();
  const copy = getWalletlessPageCopy(locale);
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#153628_0%,#091612_45%,#050b09_100%)] text-stone-100">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex justify-end">
          <LanguageSwitcher locale={locale} />
        </div>
        <div className="rounded-[2rem] border border-emerald-200/10 bg-black/20 p-8 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/75">
                {copy.eyebrow}
              </p>
              <h1 className="mt-4 text-4xl text-emerald-50 md:text-6xl">
                {copy.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300">
                {copy.body}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/command-center"
                className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200"
              >
                {copy.commandCenter}
              </Link>
              <Link
                href="/"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-stone-100 transition hover:border-emerald-200/40 hover:bg-white/5"
              >
                {copy.back}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <WalletlessWorkbench locale={locale} />
        </div>
      </section>
    </main>
  );
}
