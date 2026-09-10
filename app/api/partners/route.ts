import { NextResponse } from "next/server";
import { hasSupabaseConfig, mockPartnerOrgs, supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (!hasSupabaseConfig) {
    return NextResponse.json([...mockPartnerOrgs.values()].sort((a, b) => a.name.localeCompare(b.name)));
  }

  try {
    const { data, error } = await supabaseAdmin()
      .from("partner_orgs")
      .select("id, name, region, logo_url, tags, about, website_url, contact_name, contact_email, partner_since")
      .order("name");

    if (error) return NextResponse.json({ error: "Unable to load partner directory." }, { status: 503 });
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: "Unable to connect to partner directory." }, { status: 503 });
  }
}