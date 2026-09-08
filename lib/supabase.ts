import { createClient } from "@supabase/supabase-js";
import type { Participant } from "@/lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "demo-anon-key";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "demo-service-role-key";

export const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const mockParticipants = new Map<string, Participant>();

export type MockParticipant = Participant & {
  registration_status: "registered" | "cancelled";
  attendance_status: "not_checked_in" | "checked_in";
};

// Client-side (anon) — used by the registration form, QR page, public pages.
// The defaults allow local development and builds without a live Supabase config,
// while real deployment values can still be supplied via environment variables.
export const supabaseBrowser = createClient(url, anonKey, {
  auth: { persistSession: false },
});

// Server-side (service role) — used only inside API routes / server components
// that must read sensitive fields (dietary, accessibility, contact) for admins.
// NEVER import this file from a "use client" component.
export function supabaseAdmin() {
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
