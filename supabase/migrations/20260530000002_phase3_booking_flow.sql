-- Phase 3 booking flow — race-safe atomic hold + booking + cleanup helpers.
-- Originally applied 2026-05-30 via Supabase MCP; this file mirrors the live
-- state so the schema is fully reproducible from `supabase/migrations/`.

-- UNIQUE constraint on stripe_intent_id — second line of defense against the
-- webhook getting the same intent twice and double-confirming a booking.
ALTER TABLE bookings
  ADD CONSTRAINT bookings_stripe_intent_id_unique UNIQUE (stripe_intent_id);

-- Atomic "check window + create booking + create paired hold" — pg_advisory
-- lock serializes concurrent attempts at the same window so the
-- check-and-insert is one indivisible step.
--
-- IMPORTANT: every reference to a table column inside this function MUST be
-- qualified with the table alias. The RETURNS TABLE OUT columns
-- (booking_id, hold_id, expires_at) are in scope as implicit variables, so
-- bare `expires_at` / `booking_id` references inside SELECTs are ambiguous
-- and Postgres will reject them at runtime.
CREATE OR REPLACE FUNCTION public.create_booking_hold(
  p_appointment_type_slug text,
  p_start timestamp with time zone,
  p_end timestamp with time zone,
  p_customer_first_name text,
  p_customer_last_name text,
  p_customer_email text,
  p_customer_emails text[],
  p_customer_phone text,
  p_custom_gear_request text,
  p_addons jsonb,
  p_base_price_cents integer,
  p_coupon_code text,
  p_coupon_discount_cents integer,
  p_member_hours_applied numeric,
  p_member_discount_cents integer,
  p_processing_fee_cents integer,
  p_total_cents integer,
  p_policies_accepted_at timestamp with time zone,
  p_ttl_minutes integer,
  p_buffer_minutes integer DEFAULT 120
)
RETURNS TABLE(booking_id uuid, hold_id uuid, expires_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
declare
  v_booking_id uuid;
  v_hold_id    uuid;
  v_buffer     interval;
  v_now        timestamptz := now();
  v_expires    timestamptz;
begin
  v_buffer := make_interval(mins => p_buffer_minutes);
  v_expires := v_now + make_interval(mins => p_ttl_minutes);

  perform pg_advisory_xact_lock(hashtext('booking_window'));

  if exists (
    select 1 from bookings b
    where b.status in ('held','pending_payment','pending_approval','confirmed')
      and tstzrange(b.start_at - v_buffer, b.end_at + v_buffer, '[)') &&
          tstzrange(p_start, p_end, '[)')
  ) then
    raise exception 'booking_window_conflict_with_booking' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from holds h
    where h.expires_at > v_now
      and h.booking_id is null
      and tstzrange(h.start_at - v_buffer, h.end_at + v_buffer, '[)') &&
          tstzrange(p_start, p_end, '[)')
  ) then
    raise exception 'booking_window_conflict_with_hold' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from manual_blocks mb
    where tstzrange(mb.start_at, mb.end_at, '[)') && tstzrange(p_start, p_end, '[)')
  ) then
    raise exception 'booking_window_blocked' using errcode = 'P0001';
  end if;

  insert into bookings (
    status, appointment_type_slug, start_at, end_at,
    customer_first_name, customer_last_name, customer_email,
    customer_emails, customer_phone, custom_gear_request,
    base_price_cents, addons,
    coupon_code, coupon_discount_cents,
    member_hours_applied, member_discount_cents,
    processing_fee_cents, total_cents,
    policies_accepted_at
  )
  values (
    'pending_payment', p_appointment_type_slug, p_start, p_end,
    p_customer_first_name, p_customer_last_name, lower(p_customer_email),
    coalesce(p_customer_emails, '{}'::text[]), p_customer_phone, p_custom_gear_request,
    p_base_price_cents, coalesce(p_addons, '[]'::jsonb),
    p_coupon_code, p_coupon_discount_cents,
    p_member_hours_applied, p_member_discount_cents,
    p_processing_fee_cents, p_total_cents,
    p_policies_accepted_at
  )
  returning id into v_booking_id;

  insert into holds (start_at, end_at, expires_at, customer_email, booking_id)
  values (p_start, p_end, v_expires, lower(p_customer_email), v_booking_id)
  returning id into v_hold_id;

  return query select v_booking_id, v_hold_id, v_expires;
end;
$function$;

-- Hourly cleanup — promotes pending_payment whose hold expired → expired,
-- and deletes orphan holds older than 1h. Called from
-- GET /api/booking/cron/cleanup-holds on a Vercel cron.
CREATE OR REPLACE FUNCTION public.expire_holds_and_bookings()
RETURNS TABLE(expired_bookings integer, deleted_holds integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
declare
  v_expired_bookings integer;
  v_deleted_holds    integer;
begin
  with expired as (
    update bookings b
    set status = 'expired', updated_at = now()
    from holds h
    where h.booking_id = b.id
      and b.status = 'pending_payment'
      and h.expires_at < now()
    returning b.id
  )
  select count(*) into v_expired_bookings from expired;

  with deleted as (
    delete from holds h
    where h.expires_at < now() - interval '1 hour'
    returning h.id
  )
  select count(*) into v_deleted_holds from deleted;

  return query select v_expired_bookings, v_deleted_holds;
end;
$function$;
