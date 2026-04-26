import Link from "next/link";

import { ActorLiveSession } from "./actor-live-session";
import type { Locale } from "./lib/i18n";

type ActorId = "patient" | "doctor" | "dispensary" | "superadmin";

const actorTone = {
  patient: {
    shell: "border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))]",
    livePill: "bg-emerald-200 text-emerald-950",
    demoPill: "border border-white/15 text-white",
    accent: "text-emerald-200",
    panel: "border-emerald-200/15 bg-emerald-200/8",
  },
  doctor: {
    shell: "border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))]",
    livePill: "bg-sky-200 text-sky-950",
    demoPill: "border border-white/15 text-white",
    accent: "text-sky-200",
    panel: "border-sky-200/15 bg-sky-200/8",
  },
  dispensary: {
    shell: "border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))]",
    livePill: "bg-amber-200 text-amber-950",
    demoPill: "border border-white/15 text-white",
    accent: "text-amber-200",
    panel: "border-amber-200/15 bg-amber-200/8",
  },
  superadmin: {
    shell: "border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))]",
    livePill: "bg-sky-200 text-sky-950",
    demoPill: "border border-white/15 text-white",
    accent: "text-sky-200",
    panel: "border-sky-200/15 bg-sky-200/8",
  },
} as const;

const actorCopy = {
  es: {
    eyebrow: "Modo de entrada",
    title: "Elige entre rail live o recorrido demo.",
    body: "Una entrada para probar infraestructura real. Otra para presentar el MVP con calma y sin friccion.",
    liveTitle: "Entrar live",
    liveBody: "Usa passkeys o Freighter y vuelve a este POV con la sesion activa.",
    demoTitle: "Abrir demo",
    demoBody: "Recorre este POV como producto final, sin depender de secrets ni operaciones reales.",
    liveCta: "Abrir wallet-less",
    demoCta: "Abrir demo",
    liveBadge: "Modo live",
    demoBadge: "Modo demo",
    phaseEyebrow: "Sugerencia",
    phaseTitle: "Demo para mostrar. Live para validar.",
    phaseBody: "Empieza por demo si quieres impacto visual. Entra live cuando quieras probar submits protegidos.",
    liveFoot: "Sesiones, sponsor y acciones protegidas.",
    demoFoot: "Storytelling limpio para grants y presentaciones.",
  },
  en: {
    eyebrow: "Entry mode",
    title: "Choose between the live rail and a polished demo path.",
    body: "One entry is for real infrastructure. The other is for calm, high-quality MVP storytelling.",
    liveTitle: "Enter live",
    liveBody: "Use passkeys or Freighter, then return here with the session already active.",
    demoTitle: "Open demo",
    demoBody: "Walk this POV as a finished product without relying on secrets or live operations.",
    liveCta: "Open wallet-less",
    demoCta: "Open demo",
    liveBadge: "Live mode",
    demoBadge: "Demo mode",
    phaseEyebrow: "Recommended",
    phaseTitle: "Demo to present. Live to validate.",
    phaseBody: "Start with the demo for visual impact. Enter live when you want to test protected submits.",
    liveFoot: "Sessions, sponsor, and protected actions.",
    demoFoot: "Clean storytelling for grants and presentations.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function ActorEntryMode({
  actor,
  locale,
  demoHref,
}: {
  actor: ActorId;
  locale: Locale;
  demoHref: string;
}) {
  const tone = actorTone[actor];
  const copy = actorCopy[locale];

  return (
    <div className={`mt-8 rounded-[2.2rem] border p-5 shadow-[0_18px_60px_rgba(0,0,0,0.16)] backdrop-blur md:p-6 ${tone.shell}`}>
      <div className="grid gap-5 xl:grid-cols-[1fr_0.78fr] xl:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/65">{copy.eyebrow}</p>
          <h2 className="mt-3 max-w-3xl text-[1.9rem] leading-[1.02] text-white md:text-[2.6rem]">{copy.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 md:text-[15px]">{copy.body}</p>
        </div>

        <aside className={`rounded-[1.6rem] border p-5 ${tone.panel}`}>
          <p className="text-xs uppercase tracking-[0.22em] text-white/55">{copy.phaseEyebrow}</p>
          <h3 className={`mt-3 text-2xl leading-tight ${tone.accent}`}>{copy.phaseTitle}</h3>
          <p className="mt-3 text-sm leading-6 text-white/70">{copy.phaseBody}</p>
        </aside>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tone.livePill}`}>
            {copy.liveBadge}
          </span>
          <h3 className="mt-4 text-2xl text-white">{copy.liveTitle}</h3>
          <p className="mt-3 text-sm leading-6 text-white/75">{copy.liveBody}</p>
          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/45">{copy.liveFoot}</p>
          <Link
            href="/walletless"
            className={`mt-6 inline-flex rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-90 ${tone.livePill}`}
          >
            {copy.liveCta}
          </Link>
        </article>

        <article className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tone.demoPill}`}>
            {copy.demoBadge}
          </span>
          <h3 className="mt-4 text-2xl text-white">{copy.demoTitle}</h3>
          <p className="mt-3 text-sm leading-6 text-white/75">{copy.demoBody}</p>
          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/45">{copy.demoFoot}</p>
          <Link
            href={demoHref}
            className={`mt-6 inline-flex rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white/15 ${tone.demoPill}`}
          >
            {copy.demoCta}
          </Link>
        </article>
      </div>

      <ActorLiveSession locale={locale} />
    </div>
  );
}
