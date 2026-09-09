# OAK Foundation Partner Convening — Registration & Attendance Platform

Next.js (App Router) + Supabase implementation of the platform brief: registration
with 5 roles, QR codes for Partners, camera-based check-in, live attendance
dashboard, programme, and partner directory.

## What's implemented

- **Registration** (`/register`) — one shared form, role dropdown drives what
  happens next, per the brief's 5 scenarios.
- **QR Code page** (`/qr-code`) — Partner-only. Generates & displays a QR code,
  downloadable as PNG.
- **Check-In** (`/check-in`) — camera scanner (`html5-qrcode`) + manual code
  entry fallback. Handles success, not-found, duplicate (no double check-in
  per day), and network-error states.
- **Attendance** (`/attendance`) — live stats, role breakdown, searchable/
  filterable participant table.
- **Programme** (`/program`) — day-tabbed schedule with a personal-notes field
  per session (schedule data is currently hardcoded — see "Still to do" below).
- **Partners** (`/partners`, `/partners/[id]`) — searchable directory pulling
  from Supabase, with a full profile page per partner.
- **Role-based nav** (`components/Sidebar.tsx`) — only shows the pages a role
  is allowed to see, matching the brief's access matrix exactly.
- **Database schema** (`supabase/schema.sql`) — all tables + Row Level
  Security policies so dietary/accessibility/contact data is never readable
  by the public API, only by authenticated admins.

## Setup

1. Copy `.env.example` to `.env.local` and fill in your Supabase project's
   URL, anon key, and service role key (Project Settings → API in Supabase).
2. In the Supabase SQL editor, run `supabase/schema.sql`.
3. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

4. Open http://localhost:3000/register to test the registration flow.

## Current limitations

The following production features are not included in the current implementation:

- **Coordination Team login** — the brief calls for "admin authentication."
  Right now every role (including Coordination Team) is just tracked via
  `sessionStorage` after registering, with no password/login. Wire up
  Supabase Auth (email/password or magic link) for the Coordination Team
  role specifically, and gate `/check-in` and `/attendance` server-side
  (middleware or a server component check), not just by hiding the nav link.
- **Confirmation emails** — add a transactional email provider such as
  Resend or SendGrid to send registration details, QR code, and event info.
- **Programme content** — move the hardcoded session data in `/program` into
  a `sessions` table and query it, using the same pattern as `partner_orgs`.
- **Personal notes persistence** — currently only stored in React state
  (lost on refresh). Wire up the `personal_notes` table from the schema.
- **Partner directory seed data** — `partner_orgs` table is empty by
  default; add a seed script or enter partners via Supabase's table editor.
- **QR code payload** — currently the QR encodes just the `qr_code_id`
  string. If you want tamper resistance, consider signing it (HMAC) rather
  than using a plain lookup ID.
