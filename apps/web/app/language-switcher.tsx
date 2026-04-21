"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { LANGUAGE_COOKIE, type Locale, getLanguageSwitcherCopy } from "./lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const copy = getLanguageSwitcherCopy(locale);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function setLocale(nextLocale: Locale) {
    document.cookie = `${LANGUAGE_COOKIE}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs uppercase tracking-[0.2em] text-stone-200">
      <span className="text-stone-400">{copy.label}</span>
      <button
        type="button"
        onClick={() => setLocale("en")}
        disabled={isPending || locale === "en"}
        className={`rounded-full px-3 py-1 transition ${locale === "en" ? "bg-emerald-300 text-emerald-950" : "hover:bg-white/10"}`}
      >
        {copy.english}
      </button>
      <button
        type="button"
        onClick={() => setLocale("es")}
        disabled={isPending || locale === "es"}
        className={`rounded-full px-3 py-1 transition ${locale === "es" ? "bg-emerald-300 text-emerald-950" : "hover:bg-white/10"}`}
      >
        {copy.spanish}
      </button>
    </div>
  );
}
