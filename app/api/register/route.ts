import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { RegistrationInput, ROLE_LANDING } from "@/lib/types";

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
    // Unique violation on email = already registered
    if (error.code === "23505") {
      return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO: wire up transactional email (Resend/SendGrid) here for Partners —
  // "Send a confirmation email containing: registration details, downloadable QR, event info"

  return NextResponse.json({
    participant: data,
    redirectTo: ROLE_LANDING[body.role],
  });
}
