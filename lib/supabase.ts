import { createClient } from "@supabase/supabase-js";
import type { Participant } from "@/lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "demo-anon-key";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "demo-service-role-key";

export const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export interface PartnerOrg {
  id: string;
  name: string;
  region: string | null;
  logo_url: string | null;
  tags: string[] | null;
  about: string | null;
  website_url: string | null;
  contact_name: string | null;
  contact_email: string | null;
  partner_since: number | null;
}

type OakMockStore = {
  participants: Map<string, Participant>;
  partnerOrgs: Map<string, PartnerOrg>;
};

const globalOak = globalThis as typeof globalThis & { __oakMockStore?: OakMockStore };
const mockStore = globalOak.__oakMockStore ?? {
  participants: new Map<string, Participant>(),
  partnerOrgs: new Map<string, PartnerOrg>(),
};
globalOak.__oakMockStore = mockStore;

export const mockParticipants = mockStore.participants;
export const mockPartnerOrgs = mockStore.partnerOrgs;

export type MockParticipant = Participant & {
  registration_status: "registered" | "cancelled";
  attendance_status: "not_checked_in" | "checked_in";
};

export const supabaseBrowser = createClient(url, anonKey, {
  auth: { persistSession: false },
});

export function supabaseAdmin() {
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
