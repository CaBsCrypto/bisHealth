"use client";

import { useState, useTransition } from "react";

type PatientJourneyResponse = {
  error?: string;
  requestedBy?: string;
  generatedAt?: string;
  session?: {
    username: string;
    displayName: string;
    sponsorMode: "mock" | "fee-bump";
    credentialCount: number;
  };
  readiness?: {
    sponsorMode: "mock" | "fee-bump";
    passkeyIntegrationMode: string;
    passkeyBackendPhase: number;
    passkeyProfileStorage: string;
    nextStep: string;
  };
  patientRail?: {
    doctorAccount: string | null;
    dispensaryAccount: string | null;
    prescriptionId: string | null;
    prescriptionStatus: "ready" | "consumed" | "missing";
  };
  routes?: {
    doctor: string;
    dispensary: string;
    walletless: string;
  };
  notes?: string[];
};

export function PatientJourneySubmit({
  locale,
}: {
  locale: "en" | "es";
}) {
  const copy =
    locale === "es"
      ? {
          eyebrow: "Live journey",
          title: "Activar la sesion real del paciente.",
          body: "Este boton usa la sesion wallet-less activa para construir el packet operativo del paciente: receta actual, sponsor, estado passkeys y siguiente paso del recorrido.",
          hint: "Si aun no iniciaste sesion por passkeys, abre wallet-less primero y luego vuelve aqui.",
          submit: "Activar viaje live",
          pending: "Activando viaje...",
          success: "Sesion del paciente activada.",
          openWalletless: "Abrir wallet-less",
          nextStep: "Siguiente paso",
          sponsorMode: "Sponsor mode",
          passkeys: "Passkeys",
          railStatus: "Estado receta",
          doctor: "Doctor",
          dispensary: "Dispensario",
          notes: "Notas operativas",
          openDoctor: "Abrir medico",
          openDispensary: "Abrir dispensario",
          submitMode: "Modo de acceso",
          endpoint: "Proteccion",
          state: "En esta fase",
          endpointValue: "Sesion wallet-less requerida",
          modeValue: "Passkeys + session packet",
          stateValue: "Activa el journey real del paciente",
          resultTitle: "Journey packet",
        }
      : {
          eyebrow: "Live journey",
          title: "Activate the real patient session.",
          body: "This button uses the active wallet-less session to build the patient operational packet: current prescription, sponsor, passkey status, and next journey step.",
          hint: "If you have not signed in through passkeys yet, open wallet-less first and then return here.",
          submit: "Activate live journey",
          pending: "Activating journey...",
          success: "Patient session activated.",
          openWalletless: "Open wallet-less",
          nextStep: "Next step",
          sponsorMode: "Sponsor mode",
          passkeys: "Passkeys",
          railStatus: "Prescription status",
          doctor: "Doctor",
          dispensary: "Dispensary",
          notes: "Operational notes",
          openDoctor: "Open doctor",
          openDispensary: "Open dispensary",
          submitMode: "Access mode",
          endpoint: "Protection",
          state: "At this phase",
          endpointValue: "Wallet-less session required",
          modeValue: "Passkeys + session packet",
          stateValue: "Activates the real patient journey",
          resultTitle: "Journey packet",
        };

  const [response, setResponse] = useState<PatientJourneyResponse | null>(null);
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  function activateJourney() {
    startTransition(() => {
      setStatus(copy.pending);
      setResponse(null);

      void fetch("/api/trustleaf/patient/start-journey", {
        method: "POST",
      })
        .then(async (res) => {
          const data = (await res.json().catch(() => ({}))) as PatientJourneyResponse;
          if (!res.ok) {
            throw new Error(data.error || `HTTP ${res.status}`);
          }
          setResponse(data);
          setStatus(copy.success);
        })
        .catch((error) => {
          const message = error instanceof Error ? error.message : "Unexpected error";
          setResponse({ error: message });
          setStatus(message);
        });
    });
  }

  return (
    <div className="mt-6 rounded-[1.8rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.72))] p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">{copy.eyebrow}</p>
      <h3 className="mt-3 font-display text-3xl text-stone-950">{copy.title}</h3>
      <p className="mt-3 text-sm leading-7 text-stone-700">{copy.body}</p>
      <p className="mt-3 text-sm leading-7 text-stone-500">{copy.hint}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={activateJourney}
          disabled={isPending}
          className="rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? copy.pending : copy.submit}
        </button>
        <a
          href="/walletless"
          className="rounded-full border border-stone-900/10 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-900/5"
        >
          {copy.openWalletless}
        </a>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <InfoLine label={copy.submitMode} value={copy.modeValue} />
        <InfoLine label={copy.endpoint} value={copy.endpointValue} />
        <InfoLine label={copy.state} value={copy.stateValue} />
      </div>

      <p className="mt-4 text-sm text-stone-600">{status || "\u00A0"}</p>

      {response?.error ? (
        <div className="mt-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm leading-6 text-rose-900">
          {response.error}
        </div>
      ) : null}

      {response?.readiness ? (
        <div className="mt-5 rounded-[1.7rem] border border-stone-900/10 bg-stone-950 px-5 py-5 text-stone-100">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{copy.resultTitle}</p>
          <div className="grid gap-3 md:grid-cols-2">
            <InfoLine label={copy.nextStep} value={response.readiness.nextStep} />
            <InfoLine label={copy.sponsorMode} value={response.readiness.sponsorMode} />
            <InfoLine
              label={copy.passkeys}
              value={`${response.readiness.passkeyIntegrationMode} / phase ${response.readiness.passkeyBackendPhase}`}
            />
            <InfoLine
              label={copy.railStatus}
              value={response.patientRail?.prescriptionStatus ?? "unknown"}
            />
            <InfoLine label={copy.doctor} value={response.patientRail?.doctorAccount ?? "--"} />
            <InfoLine
              label={copy.dispensary}
              value={response.patientRail?.dispensaryAccount ?? "--"}
            />
          </div>

          {response.notes?.length ? (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{copy.notes}</p>
              <div className="mt-3 grid gap-3">
                {response.notes.map((note) => (
                  <article
                    key={note}
                    className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-stone-200"
                  >
                    {note}
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={response.routes?.doctor ?? "/doctor"}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {copy.openDoctor}
            </a>
            <a
              href={response.routes?.dispensary ?? "/dispensary"}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {copy.openDispensary}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{label}</p>
      <p className="mt-2 break-all text-sm leading-6 text-stone-100">{value}</p>
    </div>
  );
}
