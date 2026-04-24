import "server-only";

const DEFAULT_SCHEMA = "trustleaf";
const DEFAULT_USERS_TABLE = "passkey_users";
const DEFAULT_CREDENTIALS_TABLE = "passkey_credentials";

export type SupabasePasskeyRuntimeConfig = {
  enabled: boolean;
  url: string | null;
  schema: string;
  usersTable: string;
  credentialsTable: string;
};

export type SupabasePasskeyUserRow = {
  user_id: string;
  username: string;
  display_name: string;
  created_at: string;
  updated_at: string;
  credential_count: number;
  approval_status: "self-serve" | "manual-review";
  smart_wallet_status: "not-enrolled" | "deployment-ready";
};

export type SupabasePasskeyCredentialRow = {
  credential_id: string;
  user_id: string;
  public_key: string;
  counter: number;
  transports: string[] | null;
  device_type: "singleDevice" | "multiDevice";
  backed_up: boolean;
  created_at: string;
  updated_at: string;
};

export function getSupabasePasskeyRuntimeConfig(): SupabasePasskeyRuntimeConfig {
  const url = process.env.TRUST_LEAF_SUPABASE_URL?.trim() || null;
  const serviceRoleKey = process.env.TRUST_LEAF_SUPABASE_SERVICE_ROLE_KEY?.trim() || null;

  return {
    enabled: Boolean(url && serviceRoleKey),
    url,
    schema: process.env.TRUST_LEAF_SUPABASE_SCHEMA?.trim() || DEFAULT_SCHEMA,
    usersTable:
      process.env.TRUST_LEAF_SUPABASE_PASSKEY_USERS_TABLE?.trim() || DEFAULT_USERS_TABLE,
    credentialsTable:
      process.env.TRUST_LEAF_SUPABASE_PASSKEY_CREDENTIALS_TABLE?.trim() ||
      DEFAULT_CREDENTIALS_TABLE,
  };
}

export function isSupabasePasskeyStoreConfigured() {
  return getSupabasePasskeyRuntimeConfig().enabled;
}

export async function getSupabasePasskeyUserByUsername(username: string) {
  const { usersTable } = getSupabasePasskeyRuntimeConfig();
  const rows = await supabaseRestRequest<SupabasePasskeyUserRow[]>({
    table: usersTable,
    query: {
      select:
        "user_id,username,display_name,created_at,updated_at,credential_count,approval_status,smart_wallet_status",
      username: `eq.${username}`,
      limit: "1",
    },
  });

  return rows[0] ?? null;
}

export async function getSupabasePasskeyUserById(userId: string) {
  const { usersTable } = getSupabasePasskeyRuntimeConfig();
  const rows = await supabaseRestRequest<SupabasePasskeyUserRow[]>({
    table: usersTable,
    query: {
      select:
        "user_id,username,display_name,created_at,updated_at,credential_count,approval_status,smart_wallet_status",
      user_id: `eq.${userId}`,
      limit: "1",
    },
  });

  return rows[0] ?? null;
}

export async function listSupabasePasskeyCredentials(userId: string) {
  const { credentialsTable } = getSupabasePasskeyRuntimeConfig();
  return supabaseRestRequest<SupabasePasskeyCredentialRow[]>({
    table: credentialsTable,
    query: {
      select:
        "credential_id,user_id,public_key,counter,transports,device_type,backed_up,created_at,updated_at",
      user_id: `eq.${userId}`,
      order: "created_at.asc",
    },
  });
}

export async function upsertSupabasePasskeyUser(row: SupabasePasskeyUserRow) {
  const { usersTable } = getSupabasePasskeyRuntimeConfig();
  const rows = await supabaseRestRequest<SupabasePasskeyUserRow[]>({
    table: usersTable,
    method: "POST",
    query: {
      on_conflict: "user_id",
    },
    body: [row],
    prefer: "resolution=merge-duplicates,return=representation",
  });

  return rows[0] ?? row;
}

export async function upsertSupabasePasskeyCredentials(rows: SupabasePasskeyCredentialRow[]) {
  if (rows.length === 0) {
    return [];
  }

  const { credentialsTable } = getSupabasePasskeyRuntimeConfig();
  return supabaseRestRequest<SupabasePasskeyCredentialRow[]>({
    table: credentialsTable,
    method: "POST",
    query: {
      on_conflict: "credential_id",
    },
    body: rows,
    prefer: "resolution=merge-duplicates,return=representation",
  });
}

async function supabaseRestRequest<T>(args: {
  table: string;
  method?: "GET" | "POST";
  query?: Record<string, string>;
  body?: unknown;
  prefer?: string;
}) {
  const config = getSupabasePasskeyRuntimeConfig();
  const serviceRoleKey = process.env.TRUST_LEAF_SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!config.enabled || !config.url || !serviceRoleKey) {
    throw new Error("Supabase passkey store is not configured");
  }

  const url = new URL(`/rest/v1/${args.table}`, config.url);
  for (const [key, value] of Object.entries(args.query ?? {})) {
    url.searchParams.set(key, value);
  }

  const method = args.method ?? "GET";
  const response = await fetch(url, {
    method,
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
    throw new Error(`Supabase passkey request failed (${response.status})`);
  }

  return (await response.json()) as T;
}
