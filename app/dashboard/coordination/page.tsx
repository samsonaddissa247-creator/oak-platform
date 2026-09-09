"use client";

import Link from "next/link";
import { useParticipant } from "@/lib/useParticipant";

const TOOLS = [
  { href: "/check-in", label: "Check In", desc: "Scan attendee QR codes at the door", icon: "⌗" },
  { href: "/attendance", label: "Attendance", desc: "Live headcount and participant list", icon: "▤" },
  { href: "/program", label: "Programme", desc: "View and edit the event schedule", icon: "📅" },
  { href: "/partners", label: "Partners", desc: "View and edit the partner directory", icon: "🌐" },
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
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">{t.icon}</div>
            <p className="font-bold text-slate-900">{t.label}</p>
            <p className="text-sm text-slate-500">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
