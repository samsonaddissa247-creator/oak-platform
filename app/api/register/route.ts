import { NextResponse } from "next/server";
import { hasSupabaseConfig, mockParticipants, supabaseAdmin } from "@/lib/supabase";
import { Participant, RegistrationInput, ROLE_LANDING } from "@/lib/types";

function makeRegistrationId() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `OAK-${year}-${rand}`;
}

function makeQrCodeId(registrationId: string) {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${registrationId}-${suffix}`;
}

export async function POST(req: Request) {
  const body: RegistrationInput = await req.json();

  if (!body.consent) {
    return NextResponse.json({ error: "Consent is required to register." }, { status: 400 });
  }
  if (!body.first_name || !body.last_name || !body.organisation || !body.email || !body.role) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const registrationId = makeRegistrationId();
  const isPartner = body.role === "partner";
  const qrCodeId = isPartner ? makeQrCodeId(registrationId) : null;

  if (!hasSupabaseConfig) {
    const participant: Participant = {
      id: crypto.randomUUID(),
      first_name: body.first_name,
      last_name: body.last_name,
      organisation: body.organisation,
      sub_partner: body.sub_partner || null,
      role: body.role,
      email: body.email,
      phone: body.phone || null,
      dietary_requirements: body.dietary_requirements || null,
      accessibility_requirements: body.accessibility_requirements || null,
      travel_requirements: body.travel_requirements || null,
      accommodation_requirements: body.accommodation_requirements || null,
      registration_id: registrationId,
      registration_date: new Date().toISOString(),
      registration_status: "registered",
      qr_code_id: qrCodeId,
      attendance_status: "not_checked_in",
      check_in_time: null,
      check_in_date: null,
    };
    mockParticipants.set(participant.id, participant);

    return NextResponse.json({
      participant,
      redirectTo: ROLE_LANDING[body.role],
    });
  }

  const db = supabaseAdmin();

  const { data, error } = await db
    .from("participants")
    .insert({
      first_name: body.first_name,
      last_name: body.last_name,
      organisation: body.organisation,
      sub_partner: body.sub_partner || null,
      role: body.role,
      email: body.email,
      phone: body.phone || null,
      dietary_requirements: body.dietary_requirements || null,
      accessibility_requirements: body.accessibility_requirements || null,
      travel_requirements: body.travel_requirements || null,
      accommodation_requirements: body.accommodation_requirements || null,
      registration_id: registrationId,
      qr_code_id: qrCodeId,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    participant: data,
    redirectTo: ROLE_LANDING[body.role],
  });
}
