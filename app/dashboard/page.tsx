"use client";

import Link from "next/link";
import { useParticipant } from "@/lib/useParticipant";
import { ROLE_LABELS } from "@/lib/types";

export default function DashboardPage() {
  const { participant, loaded } = useParticipant();

  if (!loaded) return null;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-3 py-5 sm:px-6 sm:py-8">
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

      <div className="grid gap-4 sm:grid-cols-2">
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
