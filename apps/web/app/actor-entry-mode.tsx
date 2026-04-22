import Link from "next/link";

import type { Locale } from "./lib/i18n";

type ActorId = "patient" | "doctor" | "dispensary" | "superadmin";

const actorTone = {
  patient: {
    shell: "border-white/12 bg-white/10",
    livePill: "bg-emerald-200 text-emerald-950",
    demoPill: "border border-white/15 text-white",
  },
  doctor: {
    shell: "border-white/12 bg-white/10",
    livePill: "bg-sky-200 text-sky-950",
    demoPill: "border border-white/15 text-white",
  },
  dispensary: {
    shell: "border-white/12 bg-white/10",
    livePill: "bg-amber-200 text-amber-950",
    demoPill: "border border-white/15 text-white",
  },
  superadmin: {
    shell: "border-white/12 bg-white/8",
    livePill: "bg-sky-200 text-sky-950",
    demoPill: "border border-white/15 text-white",
  },
} as const;

const actorCopy = {
  es: {
    eyebrow: "Modo de entrada",
    title: "Passkeys para rail real o demo guiada para presentar el MVP.",
    body: "En esta fase, cada POV ofrece dos caminos: entrar por wallet-less con passkeys para probar los rails protegidos o seguir en modo demo/mockup para mostrar la experiencia completa sin friccion operativa.",
    liveTitle: "Entrar con passkeys",
    liveBody:
      "Abre el rail wallet-less, registra o inicia sesion y vuelve a este POV para probar las acciones protegidas.",
    demoTitle: "Explorar demo/mockup",
    demoBody:
      "Recorre este POV como historia de producto. Es ideal para grants, inversionistas y validacion visual del MVP.",
    liveCta: "Abrir wallet-less",
    demoCta: "Seguir en demo",
    liveBadge: "Modo live",
    demoBadge: "Modo demo",
  },
  en: {
    eyebrow: "Entry mode",
    title: "Passkeys for the live rail or guided demo mode for MVP storytelling.",
    body: "At this stage, every POV offers two paths: enter through the wallet-less passkey rail to test protected actions, or continue in demo/mockup mode to present the full experience without operational friction.",
    liveTitle: "Enter with passkeys",
    liveBody:
      "Open the wallet-less rail, register or sign in, then return to this POV to test protected actions.",
    demoTitle: "Explore demo/mockup",
    demoBody:
      "Walk this POV as a product story. It is ideal for grants, investors, and visual MVP validation.",
    liveCta: "Open wallet-less",
    demoCta: "Continue in demo",
    liveBadge: "Live mode",
    demoBadge: "Demo mode",
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
      <p className="text-xs uppercase tracking-[0.24em] text-white/65">{copy.eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-2xl leading-tight text-white md:text-3xl">{copy.title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75 md:text-base">{copy.body}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-[1.6rem] border border-white/10 bg-black/15 p-5">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tone.livePill}`}>
            {copy.liveBadge}
          </span>
          <h3 className="mt-4 text-xl text-white">{copy.liveTitle}</h3>
          <p className="mt-3 text-sm leading-7 text-white/75">{copy.liveBody}</p>
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
          <Link
            href={demoHref}
            className={`mt-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white/15 ${tone.demoPill}`}
          >
            {copy.demoCta}
          </Link>
        </article>
      </div>
    </div>
  );
}
