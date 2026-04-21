import Link from "next/link";

import type { Locale } from "./lib/i18n";

const actorLabels = {
  en: {
    patient: "Patient",
    doctor: "Doctor",
    dispensary: "Dispensary",
    superadmin: "Superadmin",
  },
  es: {
    patient: "Paciente",
    doctor: "Medico",
    dispensary: "Dispensario",
    superadmin: "Superadmin",
  },
} satisfies Record<Locale, Record<ActorRoute, string>>;

type ActorRoute = "patient" | "doctor" | "dispensary" | "superadmin";

const actorRoutes: Array<{ id: ActorRoute; href: string }> = [
  { id: "patient", href: "/patient" },
  { id: "doctor", href: "/doctor" },
  { id: "dispensary", href: "/dispensary" },
  { id: "superadmin", href: "/superadmin" },
];

export function ActorNav({
  current,
  locale,
}: {
  current: ActorRoute;
  locale: Locale;
}) {
  const labels = actorLabels[locale];

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {actorRoutes.map((route) => {
        const active = route.id === current;
        return (
          <Link
            key={route.id}
            href={route.href}
            className={`rounded-full px-4 py-2 text-sm transition ${
              active
                ? "bg-stone-950 text-stone-50"
                : "border border-stone-900/10 bg-white/55 text-stone-700 hover:bg-white/80 hover:text-stone-950"
            }`}
          >
            {labels[route.id]}
          </Link>
        );
      })}
    </div>
  );
}
