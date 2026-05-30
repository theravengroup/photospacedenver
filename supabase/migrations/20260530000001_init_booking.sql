-- Booking system — initial schema (v1)
-- Phase 1.2 · 2026-05-30
--
-- Tables:
--   bookings            confirmed (or in-flight) studio bookings
--   holds               temporary reservations during checkout (TTL)
--   coupons             promo codes + rules (email allowlist, per-user limits, etc.)
--   coupon_redemptions  audit log of who redeemed what (powers per-user enforcement)
--   manual_blocks       admin-created unavailability windows
--   member_buckets      per-member free-hours per billing cycle (replaces honor-system)
--   audit_log           admin action history
--
-- RLS is enabled on every table. Deny-anon SELECT policies are placeholders so
-- the dashboard doesn't flag tables as wide open. Service-role (server-only)
-- bypasses RLS and is used by booking/admin server actions. Customer-aware
-- policies (e.g. "user sees own bookings") land in 1.3 after Supabase Auth wires up.

-- Helpful UTCness check: all timestamps are timestamptz; America/Denver is a
-- presentation concern, not a storage one.

-- =============================================================================
-- bookings
-- =============================================================================
create table bookings (
  id                       uuid primary key default gen_random_uuid(),
  status                   text not null check (status in (
                             'draft','held','pending_payment','pending_approval',
                             'confirmed','cancelled','expired'
                           )),
  appointment_type_slug    text not null,           -- e.g. 'hourly-2', 'hourly-10-fullday'
  start_at                 timestamptz not null,
  end_at                   timestamptz not null,
  constraint bookings_end_after_start check (end_at > start_at),

  -- customer (intake)
  customer_first_name      text not null,
  customer_last_name       text not null,
  customer_email           text not null,           -- canonical contact
  customer_emails          text[] not null default '{}',  -- additional recipients
  customer_phone           text not null,
  custom_gear_request      text,

  -- priced snapshot (server-computed at hold/checkout time; locked even if prices change later)
  base_price_cents         int not null,
  addons                   jsonb not null default '[]'::jsonb, -- [{slug, label, price_cents}]
  coupon_code              text,
  coupon_discount_cents    int not null default 0,
  member_hours_applied     numeric not null default 0,
  member_discount_cents    int not null default 0,
  processing_fee_cents     int not null default 0,
  total_cents              int not null,

  -- Stripe
  stripe_intent_id         text,
  stripe_charge_id         text,

  -- Google Calendar
  gcal_event_id            text,

  -- bookkeeping
  policies_accepted_at     timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index bookings_status_window_idx on bookings (status, start_at, end_at);
create index bookings_customer_email_idx on bookings (customer_email);
create index bookings_stripe_intent_idx on bookings (stripe_intent_id);

-- =============================================================================
-- holds
-- =============================================================================
create table holds (
  id              uuid primary key default gen_random_uuid(),
  start_at        timestamptz not null,
  end_at          timestamptz not null,
  expires_at      timestamptz not null,
  constraint holds_end_after_start check (end_at > start_at),
  customer_email  text,
  booking_id      uuid references bookings(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index holds_expires_idx on holds (expires_at);
create index holds_window_idx on holds (start_at, end_at);

-- =============================================================================
-- coupons + redemptions
-- =============================================================================
create table coupons (
  code                text primary key,
  type                text not null check (type in ('percent','fixed')),
  value               int not null check (value > 0),
  usage_limit         text not null default 'unlimited'
                       check (usage_limit in ('unlimited','n_total','1_per_user','n_per_user')),
  max_total_uses      int,
  max_uses_per_user   int,
  email_allowlist     text[],                       -- if non-null/non-empty, only these emails can redeem
  applies_to_types    text[],                       -- null = all appointment types
  valid_from          timestamptz,
  valid_until         timestamptz,
  stackable           boolean not null default false,
  active              boolean not null default true,
  notes               text,
  created_at          timestamptz not null default now()
);

create table coupon_redemptions (
  id              uuid primary key default gen_random_uuid(),
  coupon_code     text not null references coupons(code) on delete cascade,
  booking_id      uuid references bookings(id) on delete cascade,
  customer_email  text not null,
  redeemed_at     timestamptz not null default now()
);

create index coupon_redemptions_email_idx on coupon_redemptions (customer_email);
create index coupon_redemptions_code_email_idx on coupon_redemptions (coupon_code, customer_email);

-- =============================================================================
-- manual_blocks
-- =============================================================================
create table manual_blocks (
  id          uuid primary key default gen_random_uuid(),
  start_at    timestamptz not null,
  end_at      timestamptz not null,
  constraint manual_blocks_end_after_start check (end_at > start_at),
  reason      text,
  created_by  text,
  created_at  timestamptz not null default now()
);

create index manual_blocks_window_idx on manual_blocks (start_at, end_at);

-- =============================================================================
-- member_buckets (free-hours tracking per member per cycle)
-- =============================================================================
create table member_buckets (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid,                           -- references auth.users when Auth wires up (1.3)
  member_email      text not null,
  tier              text not null check (tier in ('spark','creator','visionary')),
  cycle_start       timestamptz not null,
  cycle_end         timestamptz not null,
  hours_allowance   numeric not null,               -- 5, 10, or 20
  hours_used        numeric not null default 0,
  created_at        timestamptz not null default now(),
  unique (member_email, cycle_start)
);

create index member_buckets_email_window_idx on member_buckets (member_email, cycle_start, cycle_end);

-- =============================================================================
-- audit_log
-- =============================================================================
create table audit_log (
  id           uuid primary key default gen_random_uuid(),
  actor_email  text,
  action       text not null,
  target_type  text,
  target_id    text,
  details      jsonb,
  created_at   timestamptz not null default now()
);

create index audit_log_created_at_idx on audit_log (created_at desc);

-- =============================================================================
-- updated_at trigger (bookings)
-- =============================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger bookings_updated_at
  before update on bookings
  for each row execute function set_updated_at();

-- =============================================================================
-- Row Level Security — enable everywhere, deny-anon stubs.
-- service_role bypasses RLS, so server actions work fine.
-- Real customer-aware policies come in 1.3 with Supabase Auth.
-- =============================================================================
alter table bookings            enable row level security;
alter table holds               enable row level security;
alter table coupons             enable row level security;
alter table coupon_redemptions  enable row level security;
alter table manual_blocks       enable row level security;
alter table member_buckets      enable row level security;
alter table audit_log           enable row level security;

create policy "deny anon" on bookings           for all to anon using (false) with check (false);
create policy "deny anon" on holds              for all to anon using (false) with check (false);
create policy "deny anon" on coupons            for all to anon using (false) with check (false);
create policy "deny anon" on coupon_redemptions for all to anon using (false) with check (false);
create policy "deny anon" on manual_blocks      for all to anon using (false) with check (false);
create policy "deny anon" on member_buckets     for all to anon using (false) with check (false);
create policy "deny anon" on audit_log          for all to anon using (false) with check (false);
