"use client";

import Link from "next/link";
import { useParticipant } from "@/lib/useParticipant";
import { ROLE_LABELS } from "@/lib/types";

export default function DashboardPage() {
  const { participant, loaded } = useParticipant();

  if (!loaded) return null;

  return (
    <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Welcome{participant ? `, ${participant.first_name}` : ""}
        </h1>
        {participant && (
          <p className="text-slate-500 text-sm">
            Registered as {ROLE_LABELS[participant.role]} · {participant.organisation}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/program" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="text-2xl mb-2">📅</div>
          <p className="font-bold text-slate-900">Programme</p>
          <p className="text-sm text-slate-500">View the event schedule</p>
        </Link>
        <Link href="/partners" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="text-2xl mb-2">🌐</div>
          <p className="font-bold text-slate-900">Partners</p>
          <p className="text-sm text-slate-500">Browse the partner directory</p>
        </Link>
      </div>
    </div>
  );
}
