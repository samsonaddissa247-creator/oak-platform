import { NextResponse } from "next/server";
import { hasSupabaseConfig, mockParticipants, supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const qrCodeId = typeof body.qrCodeId === "string" ? body.qrCodeId.trim() : "";

  if (!qrCodeId) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  if (!hasSupabaseConfig) {
    const participant = [...mockParticipants.values()].find((p) => p.qr_code_id === qrCodeId);

    if (!participant) {
      return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });
    }

    const today = new Date().toISOString().slice(0, 10);

    if (participant.attendance_status === "checked_in" && participant.check_in_date === today) {
      return NextResponse.json({ ok: false, reason: "duplicate", participant }, { status: 409 });
    }

    const now = new Date().toISOString();
    const updated = {
      ...participant,
      attendance_status: "checked_in" as const,
      check_in_time: now,
      check_in_date: today,
    };

    mockParticipants.set(participant.id, updated);

    return NextResponse.json({ ok: true, participant: updated });
  }

  try {
    const db = supabaseAdmin();

    const { data: participant, error } = await db
      .from("participants")
      .select("*")
      .or(`qr_code_id.eq.${qrCodeId},registration_id.eq.${qrCodeId}`)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Supabase check-in lookup error:", error);
      return NextResponse.json({ ok: false, reason: "network_error" }, { status: 503 });
    }

    if (!participant) {
      return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });
    }

    const today = new Date().toISOString().slice(0, 10);

    if (participant.attendance_status === "checked_in" && participant.check_in_date === today) {
      return NextResponse.json({ ok: false, reason: "duplicate", participant }, { status: 409 });
    }

    const now = new Date().toISOString();

    const { data: updated, error: updateError } = await db
      .from("participants")
      .update({
        attendance_status: "checked_in",
        check_in_time: now,
        check_in_date: today,
      })
      .eq("id", participant.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ ok: false, reason: "network_error" }, { status: 503 });
    }

    return NextResponse.json({ ok: true, participant: updated });
  } catch {
    return NextResponse.json({ ok: false, reason: "network_error" }, { status: 503 });
  }
}
