import { NextResponse } from "next/server";
import { hasSupabaseConfig, mockPartnerOrgs, supabaseAdmin } from "@/lib/supabase";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!hasSupabaseConfig) {
    const partner = mockPartnerOrgs.get(id);
    return partner
      ? NextResponse.json(partner)
      : NextResponse.json({ error: "Partner not found." }, { status: 404 });
  }

  try {
    const { data, error } = await supabaseAdmin().from("partner_orgs").select("*").eq("id", id).single();
    if (error || !data) return NextResponse.json({ error: "Partner not found." }, { status: 404 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Unable to load partner profile." }, { status: 503 });
  }
}