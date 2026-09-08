import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const db = supabaseAdmin();

  const { data: participants, error } = await db
    .from("participants")
    .select(
      "id, first_name, last_name, organisation, role, registration_date, attendance_status, check_in_time"
    )
    .order("registration_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = participants.length;
  const checkedIn = participants.filter((p) => p.attendance_status === "checked_in").length;

  const roleBreakdown: Record<string, number> = {};
  for (const p of participants) {
    roleBreakdown[p.role] = (roleBreakdown[p.role] || 0) + 1;
  }

  return NextResponse.json({
    stats: {
      totalRegistered: total,
      totalAttendees: checkedIn,
      attendancePercentage: total ? Math.round((checkedIn / total) * 100) : 0,
      roleBreakdown,
    },
    participants,
  });
}
