"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, LayoutGrid } from "lucide-react";
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
        <Link href="/program" className="group rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#0f1f3d]">
            <CalendarDays aria-hidden="true" className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900">Programme</p>
              <p className="text-sm text-slate-500">View the event schedule</p>
            </div>
            <ArrowRight aria-hidden="true" className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
          </div>
        </Link>
        <Link href="/partners" className="group rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#0f1f3d]">
            <LayoutGrid aria-hidden="true" className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900">Partners</p>
              <p className="text-sm text-slate-500">Browse the partner directory</p>
            </div>
            <ArrowRight aria-hidden="true" className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
