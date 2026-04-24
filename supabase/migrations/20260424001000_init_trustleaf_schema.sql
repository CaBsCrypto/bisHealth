create schema if not exists trustleaf;

create or replace function trustleaf.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists trustleaf.passkey_users (
  user_id text primary key,
  username text not null unique,
  display_name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  credential_count integer not null default 0,
  approval_status text not null default 'self-serve',
  smart_wallet_status text not null default 'not-enrolled',
  constraint passkey_users_approval_status_check
    check (approval_status in ('self-serve', 'manual-review')),
  constraint passkey_users_smart_wallet_status_check
    check (smart_wallet_status in ('not-enrolled', 'deployment-ready'))
);

create table if not exists trustleaf.passkey_credentials (
  credential_id text primary key,
  user_id text not null references trustleaf.passkey_users(user_id) on delete cascade,
  public_key text not null,
  counter bigint not null default 0,
  transports jsonb,
  device_type text not null,
  backed_up boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint passkey_credentials_device_type_check
    check (device_type in ('singleDevice', 'multiDevice')),
  constraint passkey_credentials_transports_check
    check (transports is null or jsonb_typeof(transports) = 'array')
);

create index if not exists passkey_credentials_user_id_idx
  on trustleaf.passkey_credentials(user_id);

create index if not exists passkey_users_username_idx
  on trustleaf.passkey_users(username);

drop trigger if exists passkey_users_set_updated_at on trustleaf.passkey_users;
create trigger passkey_users_set_updated_at
before update on trustleaf.passkey_users
for each row
execute function trustleaf.set_updated_at();

drop trigger if exists passkey_credentials_set_updated_at on trustleaf.passkey_credentials;
create trigger passkey_credentials_set_updated_at
before update on trustleaf.passkey_credentials
for each row
execute function trustleaf.set_updated_at();

alter table trustleaf.passkey_users enable row level security;
alter table trustleaf.passkey_credentials enable row level security;

comment on schema trustleaf is
  'Trust Leaf isolated application schema for passkeys, actor profiles, and future product data.';

comment on table trustleaf.passkey_users is
  'Wallet-less passkey users for Trust Leaf, isolated from other projects sharing this Supabase instance.';

comment on table trustleaf.passkey_credentials is
  'Registered WebAuthn credentials associated with Trust Leaf passkey users.';
