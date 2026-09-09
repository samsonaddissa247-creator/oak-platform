"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardCheck, LayoutGrid, UsersRound } from "lucide-react";
import { useParticipant } from "@/lib/useParticipant";

const TOOLS = [
  { href: "/check-in", label: "Check In", desc: "Scan attendee QR codes at the door", icon: ClipboardCheck },
  { href: "/attendance", label: "Attendance", desc: "Live headcount and participant list", icon: UsersRound },
  { href: "/program", label: "Programme", desc: "View and edit the event schedule", icon: CalendarDays },
  { href: "/partners", label: "Partners", desc: "View and edit the partner directory", icon: LayoutGrid },
];

export default function CoordinationDashboard() {
  const { participant, loaded } = useParticipant();

  if (!loaded) return null;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-3 py-5 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Coordination Team{participant ? ` — ${participant.first_name}` : ""}
        </h1>
        <p className="text-slate-500 text-sm">Event control centre</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
          >
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#0f1f3d]">
              <t.icon aria-hidden="true" className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900">{t.label}</p>
                <p className="text-sm text-slate-500">{t.desc}</p>
              </div>
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
