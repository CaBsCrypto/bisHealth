"use client";

import { useMemo, useState, useTransition } from "react";

type RoleTemplate = {
  key: string;
  label: string;
  role: "DOCTOR" | "DISP" | "LAB" | "CULT";
  account: string;
  isActive: boolean;
};

type SuperAdminRoleSubmitProps = {
  locale: "en" | "es";
  initialAdmin: string;
  roleTemplates: RoleTemplate[];
  submitReady: boolean;
  submitMode: "server-signing" | "missing-secret";
};

type SuperAdminRoleResponse = {
  error?: string;
  action?: "grant_role" | "revoke_role";
  role?: "DOCTOR" | "DISP" | "LAB" | "CULT";
  account?: string;
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

export function SuperAdminRoleSubmit({
  locale,
  initialAdmin,
  roleTemplates,
  submitReady,
  submitMode,
}: SuperAdminRoleSubmitProps) {
  const copy =
    locale === "es"
      ? {
          eyebrow: "Submit live",
          title: "Otorgar o revocar accesos desde la web.",
          body: "Este rail usa el backend para firmar y enviar `grant_role` o `revoke_role` al contrato RBAC live. Requiere sesion wallet-less activa y la key admin configurada en el servidor.",
          sessionHint: "Primero inicia sesion con passkey o Freighter para habilitar este endpoint protegido.",
          envReady: "Servidor listo para firmar con la cuenta superadmin configurada.",
          envMissing:
            "Falta `TRUST_LEAF_ADMIN_SECRET_KEY` en el servidor. El panel queda listo y el submit se habilita apenas carguemos esa variable.",
          admin: "Cuenta admin",
          template: "Template",
          action: "Accion",
          targetAccount: "Cuenta objetivo",
          submit: "Ejecutar cambio RBAC",
          pending: "Enviando cambio de rol...",
          success: "Cambio RBAC enviado a testnet.",
          openExplorer: "Abrir en Stellar Expert",
          txHash: "Tx hash",
          txStatus: "Estado RPC",
          polledStatus: "Estado final",
          ledger: "Ledger",
          reset: "Restaurar defaults",
          submitMode: "Modo de submit",
          endpoint: "Proteccion",
          state: "Estado actual",
          endpointValue: "Sesion wallet-less requerida",
          modeReady: "Server signing listo",
          modePending: "Falta secret admin",
          stateReady: "Puede aprobar o revocar en testnet",
          statePending: "Modo preview / handoff",
          resultTitle: "Resultado live",
          grant: "Grant role",
          revoke: "Revoke role",
          active: "Activo",
          pendingState: "Pendiente",
        }
      : {
          eyebrow: "Live submit",
          title: "Grant or revoke access from the web.",
          body: "This rail uses the backend to sign and send `grant_role` or `revoke_role` to the live RBAC contract. It requires an active wallet-less session and the superadmin key configured on the server.",
          sessionHint: "Sign in with a passkey or Freighter first to enable this protected endpoint.",
          envReady: "Server is ready to sign with the configured superadmin account.",
          envMissing:
            "Missing `TRUST_LEAF_ADMIN_SECRET_KEY` on the server. The panel is ready and submit becomes live as soon as we load that variable.",
          admin: "Admin account",
          template: "Template",
          action: "Action",
          targetAccount: "Target account",
          submit: "Execute RBAC update",
          pending: "Submitting role change...",
          success: "RBAC update submitted to testnet.",
          openExplorer: "Open in Stellar Expert",
          txHash: "Tx hash",
          txStatus: "RPC status",
          polledStatus: "Final status",
          ledger: "Ledger",
          reset: "Reset defaults",
          submitMode: "Submit mode",
          endpoint: "Protection",
          state: "Current state",
          endpointValue: "Wallet-less session required",
          modeReady: "Server signing ready",
          modePending: "Admin secret missing",
          stateReady: "Can approve or revoke on testnet",
          statePending: "Preview / handoff mode",
          resultTitle: "Live result",
          grant: "Grant role",
          revoke: "Revoke role",
          active: "Active",
          pendingState: "Pending",
        };

  const initialTemplate = roleTemplates[0] ?? null;
  const [admin, setAdmin] = useState(initialAdmin);
  const [templateKey, setTemplateKey] = useState(initialTemplate?.key ?? "");
  const [action, setAction] = useState<"grant_role" | "revoke_role">("grant_role");
  const [account, setAccount] = useState(initialTemplate?.account ?? "");
  const [response, setResponse] = useState<SuperAdminRoleResponse | null>(null);
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  const currentTemplate = useMemo(
    () => roleTemplates.find((template) => template.key === templateKey) ?? initialTemplate,
    [initialTemplate, roleTemplates, templateKey],
  );

  function resetDefaults() {
    setAdmin(initialAdmin);
    setTemplateKey(initialTemplate?.key ?? "");
    setAction("grant_role");
    setAccount(initialTemplate?.account ?? "");
    setResponse(null);
    setStatus("");
  }

  function handleTemplateChange(nextKey: string) {
    setTemplateKey(nextKey);
    const nextTemplate = roleTemplates.find((template) => template.key === nextKey);
    if (nextTemplate) {
      setAccount(nextTemplate.account);
    }
  }

  function submitRoleUpdate() {
    if (!currentTemplate) {
      setResponse({ error: "No role template available" });
      setStatus("No role template available");
      return;
    }

    startTransition(() => {
      setStatus(copy.pending);
      setResponse(null);

      void fetch("/api/trustleaf/superadmin/update-role", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          admin,
          role: currentTemplate.role,
          account,
          action,
        }),
      })
        .then(async (res) => {
          const data = (await res.json().catch(() => ({}))) as SuperAdminRoleResponse;
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
    <div className="mt-6 rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-sky-300/70">{copy.eyebrow}</p>
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

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <InfoLine label={copy.submitMode} value={submitReady ? copy.modeReady : copy.modePending} />
        <InfoLine label={copy.endpoint} value={copy.endpointValue} />
        <InfoLine label={copy.state} value={submitReady ? copy.stateReady : copy.statePending} />
      </div>

      <div className="mt-5 grid gap-3">
        <Field label={copy.admin} value={admin} onChange={setAdmin} />
        <SelectField
          label={copy.template}
          value={templateKey}
          onChange={handleTemplateChange}
          options={roleTemplates.map((template) => ({
            value: template.key,
            label: `${template.label} · ${template.role} · ${template.isActive ? copy.active : copy.pendingState}`,
          }))}
        />
        <SelectField
          label={copy.action}
          value={action}
          onChange={(value) => setAction(value as "grant_role" | "revoke_role")}
          options={[
            { value: "grant_role", label: copy.grant },
            { value: "revoke_role", label: copy.revoke },
          ]}
        />
        <Field label={copy.targetAccount} value={account} onChange={setAccount} />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={submitRoleUpdate}
          disabled={isPending || !submitReady || !currentTemplate}
          className="rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold text-sky-950 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
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
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{copy.resultTitle}</p>
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

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-100">{value}</p>
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
        className="mt-2 w-full rounded-[1rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-300/40"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[1rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-slate-100 outline-none transition focus:border-sky-300/40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
