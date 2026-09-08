-- OAK Foundation Event Attendance Platform — Database Schema
-- Run this in the Supabase SQL editor for your project.

create extension if not exists "uuid-ossp";

-- Roles as an enum for integrity
create type user_role as enum ('partner', 'oak_staff', 'coordination_team', 'presenter', 'observer');
create type registration_status as enum ('registered', 'cancelled');
create type attendance_status as enum ('not_checked_in', 'checked_in');

-- Core participants table
create table participants (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  organisation text not null,
  sub_partner text,
  role user_role not null,
  email text not null unique,
  phone text,

  dietary_requirements text,
  accessibility_requirements text,
  travel_requirements text,
  accommodation_requirements text,

  registration_id text not null unique, -- human-readable e.g. OAK-2026-XXXX
  registration_date timestamptz not null default now(),
  registration_status registration_status not null default 'registered',

  qr_code_id text unique, -- only populated for Partners

  attendance_status attendance_status not null default 'not_checked_in',
  check_in_time timestamptz,
  check_in_date date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_participants_role on participants(role);
create index idx_participants_qr_code on participants(qr_code_id);
create index idx_participants_attendance on participants(attendance_status);

-- Session notes (Program page "Docs" feature)
create table session_notes (
  id uuid primary key default uuid_generate_v4(),
  participant_id uuid references participants(id) on delete set null,
  author_name text not null,
  author_org text,
  content text not null,
  day_label text,
  created_at timestamptz not null default now()
);

-- Personal notes on sessions (Program page "Notes" feature)
create table personal_notes (
  id uuid primary key default uuid_generate_v4(),
  participant_id uuid references participants(id) on delete cascade,
  session_id text not null,
  content text not null,
  updated_at timestamptz not null default now(),
  unique (participant_id, session_id)
);

-- Partner directory
create table partner_orgs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  region text,
  logo_url text,
  tags text[],
  about text,
  website_url text,
  contact_name text,
  contact_email text,
  partner_since int
);

-- Row Level Security
alter table participants enable row level security;
alter table session_notes enable row level security;
alter table personal_notes enable row level security;
alter table partner_orgs enable row level security;

-- Public (anon) can INSERT a registration but cannot read participant rows back
-- (sensitive fields like dietary/accessibility/contact must never be public-readable)
create policy "anyone can register" on participants
  for insert to anon with check (true);

-- Only authenticated admin/coordination-team users can read full participant data
create policy "admins can read participants" on participants
  for select to authenticated using (
    exists (
      select 1 from participants p
      where p.email = auth.jwt() ->> 'email'
      and p.role = 'coordination_team'
    )
  );

create policy "admins can update participants" on participants
  for update to authenticated using (
    exists (
      select 1 from participants p
      where p.email = auth.jwt() ->> 'email'
      and p.role = 'coordination_team'
    )
  );

-- Partner directory is publicly readable (no sensitive data lives here)
create policy "partners are publicly readable" on partner_orgs
  for select to anon, authenticated using (true);

create policy "session notes are publicly readable" on session_notes
  for select to anon, authenticated using (true);

create policy "anyone can add a session note" on session_notes
  for insert to anon, authenticated with check (true);
