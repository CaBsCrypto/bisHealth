"use client";

import { useState, useTransition } from "react";

type DoctorIssueSubmitProps = {
  locale: "en" | "es";
  initialDoctor: string;
  initialCommitment: string;
  initialPatientNullifier: string;
  initialPolicyHash: string;
  submitReady: boolean;
  submitMode: "server-signing" | "missing-secret";
};

type DoctorIssueResponse = {
  error?: string;
  submission?: {
    hash?: string;
    status?: string;
  };
  polled?: {
    status?: string;
    ledger?: number | null;
  } | null;
  explorerUrl?: string | null;
};

export function DoctorIssueSubmit({
  locale,
  initialDoctor,
  initialCommitment,
  initialPatientNullifier,
  initialPolicyHash,
  submitReady,
  submitMode,
}: DoctorIssueSubmitProps) {
  const copy =
    locale === "es"
      ? {
          eyebrow: "Submit live",
          title: "Emitir receta desde la web.",
          body: "Este rail usa el backend para firmar y enviar `issue_prescription` a testnet. Requiere una sesion wallet-less activa y una key medica configurada en el servidor.",
          sessionHint: "Primero inicia sesion en wallet-less con passkey para habilitar el endpoint protegido.",
          envReady: "Servidor listo para firmar con la cuenta medica configurada.",
          envMissing:
            "Falta `TRUST_LEAF_DOCTOR_SECRET_KEY` en el servidor. El panel queda listo y el submit se habilita apenas carguemos esa variable.",
          doctor: "Cuenta medica",
          commitment: "Commitment",
          patientNullifier: "Patient nullifier",
          policyHash: "Policy hash",
          submit: "Emitir en testnet",
          pending: "Enviando receta...",
          success: "Receta enviada a testnet.",
          openExplorer: "Abrir en Stellar Expert",
          txHash: "Tx hash",
          txStatus: "Estado RPC",
          polledStatus: "Estado final",
          ledger: "Ledger",
          reset: "Restaurar defaults",
        }
      : {
          eyebrow: "Live submit",
          title: "Issue a prescription from the web.",
          body: "This rail uses the backend to sign and send `issue_prescription` to testnet. It requires an active wallet-less session and a doctor key configured on the server.",
          sessionHint: "Sign in through wallet-less with a passkey first to enable the protected endpoint.",
          envReady: "Server is ready to sign with the configured doctor account.",
          envMissing:
            "Missing `TRUST_LEAF_DOCTOR_SECRET_KEY` on the server. The panel is ready and submit becomes live as soon as we load that variable.",
          doctor: "Doctor account",
          commitment: "Commitment",
          patientNullifier: "Patient nullifier",
          policyHash: "Policy hash",
          submit: "Issue on testnet",
          pending: "Submitting prescription...",
          success: "Prescription submitted to testnet.",
          openExplorer: "Open in Stellar Expert",
          txHash: "Tx hash",
          txStatus: "RPC status",
          polledStatus: "Final status",
          ledger: "Ledger",
          reset: "Reset defaults",
        };

  const [doctor, setDoctor] = useState(initialDoctor);
  const [commitment, setCommitment] = useState(initialCommitment);
  const [patientNullifier, setPatientNullifier] = useState(initialPatientNullifier);
  const [policyHash, setPolicyHash] = useState(initialPolicyHash);
  const [response, setResponse] = useState<DoctorIssueResponse | null>(null);
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  function resetDefaults() {
    setDoctor(initialDoctor);
    setCommitment(initialCommitment);
    setPatientNullifier(initialPatientNullifier);
    setPolicyHash(initialPolicyHash);
    setResponse(null);
    setStatus("");
  }

  function submitIssue() {
    startTransition(() => {
      setStatus(copy.pending);
      setResponse(null);

      void fetch("/api/trustleaf/doctor/issue-prescription", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          doctor,
          commitment,
          patientNullifier,
          policyHash,
        }),
      })
        .then(async (res) => {
          const data = (await res.json().catch(() => ({}))) as DoctorIssueResponse;
          if (!res.ok) {
            throw new Error(data.error || `HTTP ${res.status}`);
          }
          setResponse(data);
          setStatus(copy.success);
        })
        .catch((error) => {
          setResponse({ error: error instanceof Error ? error.message : "Unexpected error" });
          setStatus(error instanceof Error ? error.message : "Unexpected error");
        });
    });
  }

  return (
    <div className="mt-6 rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/70">{copy.eyebrow}</p>
      <h3 className="mt-3 text-2xl text-slate-50">{copy.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{copy.body}</p>
      <p className="mt-3 text-sm leading-7 text-slate-400">{copy.sessionHint}</p>
      <p
        className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-6 ${
          submitReady
            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
            : "border-amber-300/20 bg-amber-300/10 text-amber-100"
        }`}
      >
        {submitMode === "server-signing" ? copy.envReady : copy.envMissing}
      </p>

      <div className="mt-5 grid gap-3">
        <Field label={copy.doctor} value={doctor} onChange={setDoctor} />
        <Field label={copy.commitment} value={commitment} onChange={setCommitment} />
        <Field label={copy.patientNullifier} value={patientNullifier} onChange={setPatientNullifier} />
        <Field label={copy.policyHash} value={policyHash} onChange={setPolicyHash} />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={submitIssue}
          disabled={isPending || !submitReady}
          className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? copy.pending : copy.submit}
        </button>
        <button
          type="button"
          onClick={resetDefaults}
          disabled={isPending}
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {copy.reset}
        </button>
      </div>

      <p className="mt-4 text-sm text-slate-300">{status || "\u00A0"}</p>

      {response?.error ? (
        <div className="mt-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm leading-6 text-rose-100">
          {response.error}
        </div>
      ) : null}

      {response?.submission?.hash ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-200">
          <p>
            {copy.txHash}: <span className="break-all">{response.submission.hash}</span>
          </p>
          <p>
            {copy.txStatus}: {response.submission.status ?? "pending"}
          </p>
          <p>
            {copy.polledStatus}: {response.polled?.status ?? "pending"}
          </p>
          <p>
            {copy.ledger}: {response.polled?.ledger ?? "pending"}
          </p>
          {response.explorerUrl ? (
            <a
              href={response.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {copy.openExplorer}
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[1rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300/40"
      />
    </label>
  );
}
