create table if not exists trustleaf.onboarding_applications (
  application_id text primary key,
  actor_type text not null,
  full_name text not null,
  email text not null,
  organization_name text,
  country text,
  wallet_address text,
  notes text,
  status text not null default 'submitted',
  source text not null default 'public-landing',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint onboarding_actor_type_check
    check (actor_type in ('patient', 'doctor', 'dispensary', 'growshop')),
  constraint onboarding_status_check
    check (status in ('draft', 'submitted', 'approved', 'rejected'))
);

create index if not exists onboarding_actor_type_idx
  on trustleaf.onboarding_applications(actor_type);

create index if not exists onboarding_status_idx
  on trustleaf.onboarding_applications(status);

drop trigger if exists onboarding_applications_set_updated_at on trustleaf.onboarding_applications;
create trigger onboarding_applications_set_updated_at
before update on trustleaf.onboarding_applications
for each row
execute function trustleaf.set_updated_at();

alter table trustleaf.onboarding_applications enable row level security;

comment on table trustleaf.onboarding_applications is
  'Trust Leaf onboarding requests across patients, doctors, dispensaries, and growshop/brand partners.';
