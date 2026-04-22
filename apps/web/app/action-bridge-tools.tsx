"use client";

import { useState, useTransition } from "react";

export function ActionBridgeTools({
  locale,
  command,
  payloadBase64,
  apiPath,
}: {
  locale: "en" | "es";
  command: string;
  payloadBase64: string;
  apiPath: string;
}) {
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  function copyValue(value: string, successMessage: string) {
    startTransition(() => {
      void navigator.clipboard.writeText(value).then(
        () => setStatus(successMessage),
        () =>
          setStatus(
            locale === "es"
              ? "No se pudo copiar en este navegador."
              : "Copy failed in this browser.",
          ),
      );
    });
  }

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() =>
            copyValue(
              command,
              locale === "es" ? "Comando copiado." : "Command copied.",
            )
          }
          disabled={isPending}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {locale === "es" ? "Copiar comando" : "Copy command"}
        </button>
        <button
          type="button"
          onClick={() =>
            copyValue(
              payloadBase64,
              locale === "es" ? "Payload copiado." : "Payload copied.",
            )
          }
          disabled={isPending}
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {locale === "es" ? "Copiar payload" : "Copy payload"}
        </button>
        <a
          href={apiPath}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          {locale === "es" ? "Abrir JSON" : "Open JSON"}
        </a>
      </div>
      <p className="mt-3 text-sm text-slate-300">{status || "\u00A0"}</p>
    </div>
  );
}
