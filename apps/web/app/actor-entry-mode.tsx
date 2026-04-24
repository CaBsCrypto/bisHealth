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
    title: "Passkeys o Freighter para el rail real, o demo guiada para presentar el MVP.",
    body: "En esta fase, cada POV ofrece dos caminos: entrar por wallet-less con passkeys o Freighter para probar los rails protegidos, o seguir en modo demo/mockup para mostrar la experiencia completa sin friccion operativa.",
    liveTitle: "Entrar con passkeys o Freighter",
    liveBody:
      "Abre el rail wallet-less, entra con passkeys o Freighter y vuelve a este POV para probar las acciones protegidas.",
    demoTitle: "Explorar demo/mockup",
    demoBody:
      "Recorre este POV como historia de producto. Es ideal para grants, inversionistas y validacion visual del MVP.",
    liveCta: "Abrir wallet-less",
    demoCta: "Seguir en demo",
    liveBadge: "Modo live",
    demoBadge: "Modo demo",
    phaseEyebrow: "Recomendado hoy",
    phaseTitle: "Primero demo clara, despues rail protegido.",
    phaseBody:
      "Para presentar el MVP, la demo guiada suele ser el mejor punto de entrada. Cuando quieras validar la infraestructura real, entras por passkeys y vuelves al mismo POV.",
    liveFoot: "Ideal para probar endpoints protegidos, sponsor y acciones reales.",
    demoFoot: "Ideal para storytelling, grants y recorrido completo sin depender de secrets.",
  },
  en: {
    eyebrow: "Entry mode",
    title: "Passkeys or Freighter for the live rail, or guided demo mode for MVP storytelling.",
    body: "At this stage, every POV offers two paths: enter through the wallet-less rail with passkeys or Freighter to test protected actions, or continue in demo/mockup mode to present the full experience without operational friction.",
    liveTitle: "Enter with passkeys or Freighter",
    liveBody:
      "Open the wallet-less rail, sign in with passkeys or Freighter, then return to this POV to test protected actions.",
    demoTitle: "Explore demo/mockup",
    demoBody:
      "Walk this POV as a product story. It is ideal for grants, investors, and visual MVP validation.",
    liveCta: "Open wallet-less",
    demoCta: "Continue in demo",
    liveBadge: "Live mode",
    demoBadge: "Demo mode",
    phaseEyebrow: "Recommended today",
    phaseTitle: "Clear demo first, protected rail second.",
    phaseBody:
      "For MVP presentations, the guided demo is usually the best entry point. When you want to validate the real infrastructure, enter through passkeys and return to the same POV.",
    liveFoot: "Best for testing protected endpoints, sponsorship, and real actions.",
    demoFoot: "Best for storytelling, grants, and full walkthroughs without secrets.",
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
    <div className={`mt-8 rounded-[2rem] border p-5 backdrop-blur ${tone.shell}`}>
      <div className="grid gap-5 xl:grid-cols-[1fr_0.78fr] xl:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/65">{copy.eyebrow}</p>
          <h2 className="mt-3 max-w-3xl text-2xl leading-tight text-white md:text-3xl">{copy.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75 md:text-base">{copy.body}</p>
        </div>

        <aside className={`rounded-[1.6rem] border p-5 ${tone.panel}`}>
          <p className="text-xs uppercase tracking-[0.22em] text-white/55">{copy.phaseEyebrow}</p>
          <h3 className={`mt-3 text-xl leading-tight ${tone.accent}`}>{copy.phaseTitle}</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">{copy.phaseBody}</p>
        </aside>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-[1.6rem] border border-white/10 bg-black/15 p-5">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tone.livePill}`}>
            {copy.liveBadge}
          </span>
          <h3 className="mt-4 text-xl text-white">{copy.liveTitle}</h3>
          <p className="mt-3 text-sm leading-7 text-white/75">{copy.liveBody}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/45">{copy.liveFoot}</p>
          <Link
            href="/walletless"
            className={`mt-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-90 ${tone.livePill}`}
          >
            {copy.liveCta}
          </Link>
        </article>

        <article className="rounded-[1.6rem] border border-white/10 bg-black/15 p-5">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tone.demoPill}`}>
            {copy.demoBadge}
          </span>
          <h3 className="mt-4 text-xl text-white">{copy.demoTitle}</h3>
          <p className="mt-3 text-sm leading-7 text-white/75">{copy.demoBody}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/45">{copy.demoFoot}</p>
          <Link
            href={demoHref}
            className={`mt-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white/15 ${tone.demoPill}`}
          >
            {copy.demoCta}
          </Link>
        </article>
      </div>

      <ActorLiveSession locale={locale} />
    </div>
  );
}
