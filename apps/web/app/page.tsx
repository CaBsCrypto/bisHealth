import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "./language-switcher";
import { getHomeCopy, getMarketingData } from "./lib/i18n";
import { getLocale } from "./lib/locale";

export default async function HomePage() {
  const locale = await getLocale();
  const copy = getHomeCopy(locale);
  const { faqs, heroStats, networkRoles, patientBenefits, patientJourney, signalStrip, trustPanels } =
    getMarketingData(locale);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-stone-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(120,255,191,0.18),transparent_22%),radial-gradient(circle_at_85%_10%,rgba(255,196,87,0.18),transparent_20%),radial-gradient(circle_at_60%_35%,rgba(113,210,255,0.12),transparent_24%),linear-gradient(180deg,#0a1120_0%,#07100d_30%,#050816_72%,#04070f_100%)]" />

      <section className="relative mx-auto max-w-7xl px-6 py-8 md:py-10">
        <header className="rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-300/15 text-sm font-semibold text-emerald-200">
                TL
              </div>
              <div>
                <p className="font-display text-2xl leading-none text-stone-50">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-stone-400">
                  {copy.brandTag}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/command-center"
                className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
              >
                {copy.navCommandCenter}
              </Link>
              <Link
                href="/walletless"
                className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
              >
                {copy.navWalletless}
              </Link>
              <Link
                href="/superadmin"
                className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:bg-white/5 hover:text-stone-100"
              >
                {copy.navSuperadmin}
              </Link>
              <LanguageSwitcher locale={locale} />
              <Link
                href="/patient"
                className="rounded-full bg-emerald-300 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200"
              >
                {copy.navCta}
              </Link>
            </div>
          </div>
        </header>

        <section className="relative mt-8 overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,14,23,0.96),rgba(13,28,21,0.94)_45%,rgba(10,11,20,0.98))] px-6 py-8 shadow-[0_40px_140px_rgba(0,0,0,0.45)] md:px-8 md:py-10 xl:px-10 xl:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,255,191,0.13),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(255,211,112,0.12),transparent_24%),radial-gradient(circle_at_60%_70%,rgba(111,175,255,0.14),transparent_28%)]" />
          <div className="relative grid gap-10 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-300 hero-pulse" />
                {copy.announcement}
              </div>

              <p className="mt-6 text-sm uppercase tracking-[0.34em] text-stone-400">{copy.eyebrow}</p>
              <h1 className="font-display mt-6 max-w-4xl text-6xl leading-[0.95] text-stone-50 md:text-7xl xl:text-[5.9rem]">
                {copy.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-200 md:text-xl">
                {copy.body}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-400">
                {copy.supportingBody}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/patient"
                  className="rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200"
                >
                  {copy.primaryCta}
                </Link>
                <Link
                  href="/walletless"
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-white/25 hover:bg-white/10"
                >
                  {copy.secondaryCta}
                </Link>
                <Link
                  href="/command-center"
                  className="rounded-full px-4 py-3 text-sm text-stone-300 transition hover:text-stone-100"
                >
                  {copy.tertiaryCta}
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {signalStrip.map((item) => (
                  <SignalPill key={item}>{item}</SignalPill>
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5 backdrop-blur"
                  >
                    <p className="text-sm leading-6 text-stone-400">{stat.label}</p>
                    <p className="font-display mt-3 text-5xl leading-none text-stone-50">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="relative">
              <div className="hero-drift-slow absolute -left-4 top-10 h-24 w-24 rounded-full bg-emerald-300/10 blur-2xl" />
              <div className="hero-drift absolute right-6 top-0 h-20 w-20 rounded-full bg-sky-300/10 blur-2xl" />

              <div className="relative rounded-[2.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-4 shadow-[0_32px_100px_rgba(0,0,0,0.35)] backdrop-blur md:p-5">
                <div className="rounded-[2rem] border border-white/10 bg-[#09131f]/90 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-emerald-300/70">
                        {copy.heroMockupTitle}
                      </p>
                      <p className="mt-3 max-w-md text-sm leading-7 text-stone-300">
                        {copy.heroMockupBody}
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-200">
                      live
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <MockupCard
                      accent="emerald"
                      label={copy.appointmentLabel}
                      value={copy.appointmentValue}
                    />
                    <MockupCard
                      accent="amber"
                      label={copy.prescriptionLabel}
                      value={copy.prescriptionValue}
                    />
                    <MockupCard
                      accent="sky"
                      label={copy.purchaseLabel}
                      value={copy.purchaseValue}
                    />
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <MiniStatusPill tone="emerald">{copy.privatePill}</MiniStatusPill>
                    <MiniStatusPill tone="amber">{copy.trustPill}</MiniStatusPill>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[0.58fr_0.42fr]">
                  <div className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.26em] text-stone-400">{copy.signalEyebrow}</p>
                    <h2 className="font-display mt-3 text-3xl leading-tight text-stone-50">
                      {copy.signalTitle}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-stone-300">{copy.heroPromise}</p>
                  </div>
                  <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5">
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-stone-200">
                        Face ID
                      </div>
                      <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-stone-200">
                        Zero-Knowledge
                      </div>
                      <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-stone-200">
                        Gas-less UX
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-24">
          <SectionHeader eyebrow={copy.journeyEyebrow} title={copy.journeyTitle} />
          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            {patientJourney.map((step) => (
              <article
                key={step.step}
                className="group rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,17,26,0.94),rgba(8,13,18,0.98))] p-6 transition hover:-translate-y-1 hover:border-emerald-200/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-6xl leading-none text-stone-500/70">
                    {step.step}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-200">
                    {step.state}
                  </span>
                </div>
                <h3 className="font-display mt-8 text-4xl leading-tight text-stone-50">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-stone-300">{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <SectionHeader eyebrow={copy.benefitsEyebrow} title={copy.benefitsTitle} />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-12">
            {patientBenefits.map((card, index) => (
              <article
                key={card.name}
                className={`rounded-[2.2rem] border border-white/10 bg-gradient-to-br ${card.accent} p-6 ${
                  index === 0 ? "md:col-span-2 xl:col-span-7" : ""
                } ${index === 1 ? "xl:col-span-5" : ""} ${index === 2 ? "xl:col-span-5" : ""} ${
                  index === 3 ? "md:col-span-2 xl:col-span-7" : ""
                }`}
              >
                <p className="text-sm uppercase tracking-[0.24em] text-stone-300">{card.name}</p>
                <h3 className="font-display mt-4 max-w-xl text-4xl leading-tight text-stone-50">
                  {card.headline}
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-stone-200">{card.body}</p>
                <p className="mt-8 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-stone-100">
                  {card.cta}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-24 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2.3rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,15,24,0.96),rgba(6,10,18,0.92))] p-6 md:p-7">
            <SectionHeader eyebrow={copy.trustEyebrow} title={copy.trustTitle} compact />
            <div className="mt-8 grid gap-4">
              {trustPanels.map((panel) => (
                <div key={panel.title} className="rounded-[1.8rem] border border-white/8 bg-white/5 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display max-w-lg text-3xl leading-tight text-stone-50">
                      {panel.title}
                    </h3>
                    <span className="rounded-full bg-sky-300/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-sky-200">
                      {panel.metric}
                    </span>
                  </div>
                  <p className="mt-4 text-base leading-7 text-stone-300">{panel.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.3rem] border border-white/10 bg-[linear-gradient(180deg,rgba(24,16,8,0.96),rgba(12,10,7,0.92))] p-6 md:p-7">
            <SectionHeader eyebrow={copy.rolesEyebrow} title={copy.rolesTitle} compact />
            <div className="mt-8 grid gap-4">
              {networkRoles.map((role) => (
                <Link
                  key={role.name}
                  href={role.href}
                  className="group rounded-[1.8rem] border border-white/8 bg-black/15 p-5 transition hover:border-amber-200/20 hover:bg-white/5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-amber-200/70">
                        {role.name}
                      </p>
                      <p className="mt-3 max-w-xl text-base leading-7 text-stone-200">{role.detail}</p>
                    </div>
                    <span className="rounded-full bg-amber-300/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-100">
                      {copy.roleBadge}
                    </span>
                  </div>
                  <p className="mt-5 text-sm font-semibold text-stone-50 transition group-hover:text-amber-100">
                    {role.cta}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-24">
          <SectionHeader eyebrow={copy.faqEyebrow} title={copy.faqTitle} />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {faqs.map((item) => (
              <article
                key={item.question}
                className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6"
              >
                <h3 className="font-display text-3xl leading-tight text-stone-50">{item.question}</h3>
                <p className="mt-4 text-base leading-7 text-stone-300">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-24 rounded-[2.7rem] border border-emerald-200/10 bg-[linear-gradient(135deg,rgba(17,52,40,0.98),rgba(9,12,22,0.98))] p-8 shadow-[0_32px_120px_rgba(0,0,0,0.35)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/70">{copy.joinEyebrow}</p>
              <h2 className="font-display mt-4 max-w-4xl text-5xl leading-[0.96] text-emerald-50 md:text-6xl">
                {copy.joinTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-200">{copy.joinBody}</p>
              <p className="mt-6 text-sm uppercase tracking-[0.22em] text-stone-400">{copy.finalNote}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Link
                href="/patient"
                className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 transition hover:bg-white/12"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/70">Patient lane</p>
                <p className="font-display mt-3 text-3xl text-stone-50">{copy.joinPrimaryCta}</p>
              </Link>
              <Link
                href="/doctor"
                className="rounded-[1.8rem] border border-white/10 bg-black/15 p-5 transition hover:bg-white/5"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-sky-300/70">Doctor lane</p>
                <p className="font-display mt-3 text-3xl text-stone-50">{copy.joinDoctorCta}</p>
              </Link>
              <Link
                href="/dispensary"
                className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5 transition hover:bg-white/5"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">Dispensary lane</p>
                <p className="font-display mt-3 text-3xl text-stone-50">{copy.joinDispensaryCta}</p>
              </Link>
              <Link
                href="/superadmin"
                className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5 transition hover:bg-white/5"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-sky-300/70">Governance lane</p>
                <p className="font-display mt-3 text-3xl text-stone-50">{copy.joinSuperadminCta}</p>
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function SectionHeader({
  eyebrow,
  title,
  compact = false,
}: {
  compact?: boolean;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className={compact ? "max-w-2xl" : "max-w-3xl"}>
      <p className="text-sm uppercase tracking-[0.3em] text-stone-400">{eyebrow}</p>
      <h2 className="font-display mt-4 text-5xl leading-[0.96] text-stone-50 md:text-6xl">
        {title}
      </h2>
    </div>
  );
}

function SignalPill({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone-200">
      {children}
    </div>
  );
}

function MiniStatusPill({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "amber" | "emerald";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
      : "border-amber-300/20 bg-amber-300/10 text-amber-100";

  return (
    <div className={`rounded-full border px-4 py-3 text-center text-xs uppercase tracking-[0.22em] ${toneClass}`}>
      {children}
    </div>
  );
}

function MockupCard({
  accent,
  label,
  value,
}: {
  accent: "amber" | "emerald" | "sky";
  label: string;
  value: string;
}) {
  const accentClass = {
    amber: "text-amber-200 bg-amber-300/10 border-amber-300/10",
    emerald: "text-emerald-200 bg-emerald-300/10 border-emerald-300/10",
    sky: "text-sky-200 bg-sky-300/10 border-sky-300/10",
  }[accent];

  return (
    <div className={`rounded-[1.5rem] border p-4 ${accentClass}`}>
      <p className="text-xs uppercase tracking-[0.24em] opacity-75">{label}</p>
      <p className="mt-3 text-sm leading-7 text-stone-100">{value}</p>
    </div>
  );
}
