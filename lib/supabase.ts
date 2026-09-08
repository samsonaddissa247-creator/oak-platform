import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side (anon) — used by the registration form, QR page, public pages
export const supabaseBrowser = createClient(url, anonKey);

// Server-side (service role) — used only inside API routes / server components
// that must read sensitive fields (dietary, accessibility, contact) for admins.
// NEVER import this file from a "use client" component.
export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
