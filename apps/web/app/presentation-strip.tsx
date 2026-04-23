import Link from "next/link";

import type { Locale } from "./lib/i18n";

type StripKey =
  | "landing"
  | "demo"
  | "patient"
  | "doctor"
  | "dispensary"
  | "superadmin"
  | "ops"
  | "walletless";

const stripItems: Record<StripKey, { href: string; label: Record<Locale, string> }> = {
  landing: {
    href: "/",
    label: { es: "Landing", en: "Landing" },
  },
  demo: {
    href: "/demo-script",
    label: { es: "Demo script", en: "Demo script" },
  },
  patient: {
    href: "/patient",
    label: { es: "Paciente", en: "Patient" },
  },
  doctor: {
    href: "/doctor",
    label: { es: "Medico", en: "Doctor" },
  },
  dispensary: {
    href: "/dispensary",
    label: { es: "Dispensario", en: "Dispensary" },
  },
  superadmin: {
    href: "/superadmin",
    label: { es: "Superadmin", en: "Superadmin" },
  },
  ops: {
    href: "/command-center",
    label: { es: "Command center", en: "Command center" },
  },
  walletless: {
    href: "/walletless",
    label: { es: "Wallet-less", en: "Wallet-less" },
  },
};

export function PresentationStrip({
  locale,
  current,
  dark = false,
}: {
  locale: Locale;
  current: StripKey;
  dark?: boolean;
}) {
  return (
    <div className={`mt-6 overflow-x-auto rounded-[1.6rem] border px-4 py-4 ${dark ? "border-white/10 bg-white/5" : "border-[#163c30]/10 bg-white/72"}`}>
      <div className="flex min-w-max items-center gap-3">
        {(Object.keys(stripItems) as StripKey[]).map((key) => {
          const item = stripItems[key];
          const active = key === current;

          return (
            <Link
              key={key}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                dark
                  ? active
                    ? "bg-white text-slate-950"
                    : "border border-white/10 text-stone-200 hover:bg-white/10"
                  : active
                    ? "bg-[#163c30] text-[#eef5f1]"
                    : "border border-[#163c30]/10 text-[#3d554c] hover:bg-[#163c30]/5"
              }`}
            >
              {item.label[locale]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
