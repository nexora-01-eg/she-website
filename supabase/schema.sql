-- SHE — Supabase schema (Launch-Ready v1)
-- Run once in the Supabase SQL editor (or via migration). RLS ON everywhere.
-- Storefront inserts as `anon` (public site must create orders without login);
-- reads/exports use `service_role` (server only, never shipped to the browser).

create table if not exists orders (
  code text primary key,
  items jsonb not null,
  name text not null,
  phone text not null,
  zone text not null,
  address text not null,
  notes text not null default '',
  total integer not null,
  delivery_fee text not null default 'TODO',
  channel text not null default 'form',
  utm text,
  source text not null default 'seed-prices',
  created_at timestamptz not null default now()
);

create table if not exists inner_circle (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  interest text not null, -- 'bags' | 'shoes'
  consent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists import_snapshots (
  id bigint generated always as identity primary key,
  report_no text not null,
  report_date date,
  payload jsonb not null,
  diff jsonb,
  created_at timestamptz not null default now()
);

alter table orders enable row level security;
alter table inner_circle enable row level security;
alter table import_snapshots enable row level security;

-- Public storefront: insert-only (no select/update/delete for anon).
drop policy if exists "anon insert orders" on orders;
create policy "anon insert orders" on orders
  for insert to anon with check (true);

drop policy if exists "anon insert inner_circle" on inner_circle;
create policy "anon insert inner_circle" on inner_circle
  for insert to anon with check (true);

-- import_snapshots: service_role only (bypasses RLS). No anon policies = denied.
