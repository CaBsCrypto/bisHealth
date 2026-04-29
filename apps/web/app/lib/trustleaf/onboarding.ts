import "server-only";

import { randomUUID } from "node:crypto";

export type ActorType = "patient" | "doctor" | "dispensary" | "growshop";
export type ApplicationStatus = "draft" | "submitted" | "approved" | "rejected";

export type TrustLeafOnboardingApplication = {
  applicationId: string;
  actorType: ActorType;
  fullName: string;
  email: string;
  organizationName: string | null;
  country: string | null;
  walletAddress: string | null;
  notes: string | null;
  status: ApplicationStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
};

type RuntimeConfig = {
  enabled: boolean;
  url: string | null;
  schema: string;
  applicationsTable: string;
};

type SupabaseOnboardingRow = {
  application_id: string;
  actor_type: ActorType;
  full_name: string;
  email: string;
  organization_name: string | null;
  country: string | null;
  wallet_address: string | null;
  notes: string | null;
  status: ApplicationStatus;
  source: string;
  created_at: string;
  updated_at: string;
};

const DEFAULT_SCHEMA = "trustleaf";
const DEFAULT_APPLICATIONS_TABLE = "onboarding_applications";

const fallbackQueue: TrustLeafOnboardingApplication[] = [
  {
    applicationId: "preview-doctor-001",
    actorType: "doctor",
    fullName: "Camila Rojas",
    email: "camila.rojas@preview.trustleaf",
    organizationName: "Consulta Andes",
    country: "Chile",
    walletAddress: null,
    notes: "Pain management and cannabis follow-up.",
    status: "submitted",
    source: "public-landing",
    createdAt: "2026-04-29T07:40:00.000Z",
    updatedAt: "2026-04-29T07:40:00.000Z",
  },
  {
    applicationId: "preview-dispensary-001",
    actorType: "dispensary",
    fullName: "Green North Ops",
    email: "ops@greennorth.preview",
    organizationName: "Green North Dispensary",
    country: "Chile",
    walletAddress: null,
    notes: "Ready to publish inventory and traceability metadata.",
    status: "submitted",
    source: "partner-referral",
    createdAt: "2026-04-29T07:45:00.000Z",
    updatedAt: "2026-04-29T07:45:00.000Z",
  },
  {
    applicationId: "preview-growshop-001",
    actorType: "growshop",
    fullName: "Patagonia Care Team",
    email: "hola@patagoniacare.preview",
    organizationName: "Patagonia Care",
    country: "Argentina",
    walletAddress: null,
    notes: "Associated brand looking to publish products for the community.",
    status: "draft",
    source: "brand-outreach",
    createdAt: "2026-04-29T07:50:00.000Z",
    updatedAt: "2026-04-29T07:50:00.000Z",
  },
];

export function getTrustLeafOnboardingRuntimeConfig(): RuntimeConfig {
  const url = process.env.TRUST_LEAF_SUPABASE_URL?.trim() || null;
  const serviceRoleKey = process.env.TRUST_LEAF_SUPABASE_SERVICE_ROLE_KEY?.trim() || null;

  return {
    enabled: Boolean(url && serviceRoleKey),
    url,
    schema: process.env.TRUST_LEAF_SUPABASE_SCHEMA?.trim() || DEFAULT_SCHEMA,
    applicationsTable:
      process.env.TRUST_LEAF_SUPABASE_ONBOARDING_APPLICATIONS_TABLE?.trim() ||
      DEFAULT_APPLICATIONS_TABLE,
  };
}

export async function submitTrustLeafOnboardingApplication(input: {
  actorType: ActorType;
  fullName: string;
  email: string;
  organizationName?: string | null;
  country?: string | null;
  walletAddress?: string | null;
  notes?: string | null;
  source?: string | null;
}) {
  const application = normalizeApplicationInput(input);

  try {
    const row = await upsertSupabaseApplication(toSupabaseRow(application));
    return {
      storageMode: "durable-db" as const,
      persisted: true,
      application: fromSupabaseRow(row),
    };
  } catch {
    return {
      storageMode: "preview-fallback" as const,
      persisted: false,
      application,
    };
  }
}

export async function listTrustLeafOnboardingQueue(filters?: {
  actorType?: ActorType;
  status?: ApplicationStatus;
}) {
  try {
    const rows = await listSupabaseApplications(filters);
    return {
      storageMode: "durable-db" as const,
      applications: rows.map(fromSupabaseRow),
    };
  } catch {
    return {
      storageMode: "preview-fallback" as const,
      applications: fallbackQueue.filter((item) => {
        if (filters?.actorType && item.actorType !== filters.actorType) return false;
        if (filters?.status && item.status !== filters.status) return false;
        return true;
      }),
    };
  }
}

export async function updateTrustLeafOnboardingApplicationStatus(input: {
  applicationId: string;
  status: ApplicationStatus;
}) {
  const applicationId = input.applicationId.trim();

  if (!applicationId) {
    throw new Error("application_id_required");
  }

  try {
    const row = await updateSupabaseApplicationStatus({
      applicationId,
      status: input.status,
    });

    return {
      storageMode: "durable-db" as const,
      persisted: true,
      application: fromSupabaseRow(row),
    };
  } catch {
    const application = updateFallbackApplicationStatus({
      applicationId,
      status: input.status,
    });

    return {
      storageMode: "preview-fallback" as const,
      persisted: false,
      application,
    };
  }
}

function normalizeApplicationInput(input: {
  actorType: ActorType;
  fullName: string;
  email: string;
  organizationName?: string | null;
  country?: string | null;
  walletAddress?: string | null;
  notes?: string | null;
  source?: string | null;
}): TrustLeafOnboardingApplication {
  const now = new Date().toISOString();

  return {
    applicationId: randomUUID(),
    actorType: input.actorType,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    organizationName: normalizeOptional(input.organizationName),
    country: normalizeOptional(input.country),
    walletAddress: normalizeOptional(input.walletAddress),
    notes: normalizeOptional(input.notes),
    status: "submitted",
    source: normalizeOptional(input.source) ?? "public-landing",
    createdAt: now,
    updatedAt: now,
  };
}

function normalizeOptional(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function fromSupabaseRow(row: SupabaseOnboardingRow): TrustLeafOnboardingApplication {
  return {
    applicationId: row.application_id,
    actorType: row.actor_type,
    fullName: row.full_name,
    email: row.email,
    organizationName: row.organization_name,
    country: row.country,
    walletAddress: row.wallet_address,
    notes: row.notes,
    status: row.status,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toSupabaseRow(application: TrustLeafOnboardingApplication): SupabaseOnboardingRow {
  return {
    application_id: application.applicationId,
    actor_type: application.actorType,
    full_name: application.fullName,
    email: application.email,
    organization_name: application.organizationName,
    country: application.country,
    wallet_address: application.walletAddress,
    notes: application.notes,
    status: application.status,
    source: application.source,
    created_at: application.createdAt,
    updated_at: application.updatedAt,
  };
}

async function listSupabaseApplications(filters?: {
  actorType?: ActorType;
  status?: ApplicationStatus;
}) {
  const config = getTrustLeafOnboardingRuntimeConfig();
  return supabaseRequest<SupabaseOnboardingRow[]>({
    table: config.applicationsTable,
    query: {
      select:
        "application_id,actor_type,full_name,email,organization_name,country,wallet_address,notes,status,source,created_at,updated_at",
      ...(filters?.actorType ? { actor_type: `eq.${filters.actorType}` } : {}),
      ...(filters?.status ? { status: `eq.${filters.status}` } : {}),
      order: "created_at.desc",
    },
  });
}

async function upsertSupabaseApplication(row: SupabaseOnboardingRow) {
  const config = getTrustLeafOnboardingRuntimeConfig();
  const rows = await supabaseRequest<SupabaseOnboardingRow[]>({
    table: config.applicationsTable,
    method: "POST",
    query: {
      on_conflict: "application_id",
    },
    body: [row],
    prefer: "resolution=merge-duplicates,return=representation",
  });

  return rows[0] ?? row;
}

async function updateSupabaseApplicationStatus(input: {
  applicationId: string;
  status: ApplicationStatus;
}) {
  const config = getTrustLeafOnboardingRuntimeConfig();
  const rows = await supabaseRequest<SupabaseOnboardingRow[]>({
    table: config.applicationsTable,
    method: "PATCH",
    query: {
      application_id: `eq.${input.applicationId}`,
      select:
        "application_id,actor_type,full_name,email,organization_name,country,wallet_address,notes,status,source,created_at,updated_at",
    },
    body: {
      status: input.status,
    },
    prefer: "return=representation",
  });

  const row = rows[0];
  if (!row) {
    throw new Error("application_not_found");
  }

  return row;
}

function updateFallbackApplicationStatus(input: {
  applicationId: string;
  status: ApplicationStatus;
}) {
  const match = fallbackQueue.find((item) => item.applicationId === input.applicationId);

  if (!match) {
    throw new Error("application_not_found");
  }

  match.status = input.status;
  match.updatedAt = new Date().toISOString();
  return match;
}

async function supabaseRequest<T>(args: {
  table: string;
  method?: "GET" | "POST" | "PATCH";
  query?: Record<string, string>;
  body?: unknown;
  prefer?: string;
}) {
  const config = getTrustLeafOnboardingRuntimeConfig();
  const serviceRoleKey = process.env.TRUST_LEAF_SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!config.enabled || !config.url || !serviceRoleKey) {
    throw new Error("Supabase onboarding store is not configured");
  }

  const url = new URL(`/rest/v1/${args.table}`, config.url);
  for (const [key, value] of Object.entries(args.query ?? {})) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    method: args.method ?? "GET",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Accept: "application/json",
      "Accept-Profile": config.schema,
      "Content-Profile": config.schema,
      ...(args.prefer ? { Prefer: args.prefer } : {}),
      ...(args.body ? { "Content-Type": "application/json" } : {}),
    },
    ...(args.body ? { body: JSON.stringify(args.body) } : {}),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase onboarding request failed (${response.status})`);
  }

  return (await response.json()) as T;
}
