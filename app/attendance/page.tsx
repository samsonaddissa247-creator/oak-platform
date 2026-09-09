"use client";

import { useEffect, useMemo, useState } from "react";
import { ROLE_LABELS, UserRole } from "@/lib/types";

interface Row {
  id: string;
  first_name: string;
  last_name: string;
  organisation: string;
  role: UserRole;
  registration_date: string;
  attendance_status: "checked_in" | "not_checked_in";
  check_in_time: string | null;
}

interface AttendanceStats {
  totalRegistered: number;
  totalAttendees: number;
  attendancePercentage: number;
  roleBreakdown: Partial<Record<UserRole, number>>;
}

export default function AttendancePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"checked_in" | "not_checked_in" | "all">("all");
  const roleEntries = Object.entries(ROLE_LABELS) as [UserRole, string][];

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await fetch("/api/attendance", {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        const data = await res.json().catch(() => ({}));

        if (!active) return;

        if (!res.ok) {
          setRows([]);
          setStats(null);
          return;
        }

        setRows(data.participants || []);
        setStats(data.stats || null);
      } catch {
        if (active) {
          setRows([]);
          setStats(null);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        !search ||
        `${r.first_name} ${r.last_name} ${r.organisation}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || r.role === roleFilter;
      const matchesStatus = statusFilter === "all" || r.attendance_status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [rows, search, roleFilter, statusFilter]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-3 py-5 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Attendance</h1>
        <p className="text-sm text-slate-500">Check-in tracking · 9–11 November 2026</p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Expected" value={stats.totalRegistered} />
          <StatCard label="Checked In" value={stats.totalAttendees} />
          <StatCard label="Attendance %" value={`${stats.attendancePercentage}%`} />
        </div>
      )}

      {stats && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
            Role Breakdown
          </p>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3 lg:grid-cols-5">
            {roleEntries.map(([key, label]) => (
              <div key={key} className="bg-slate-50 rounded-xl py-3">
                <div className="text-xl font-bold text-slate-900">
                  {stats.roleBreakdown[key] ?? 0}
                </div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            className="input flex-1"
            placeholder="Search name or organisation…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input w-full lg:w-40"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
          >
            <option value="all">All roles</option>
            {Object.entries(ROLE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="input w-full lg:w-44"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "checked_in" | "not_checked_in" | "all")
            }
          >
            <option value="all">All statuses</option>
            <option value="checked_in">Checked in</option>
            <option value="not_checked_in">Pending</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100">
              <th className="py-2">Name</th>
              <th>Organisation</th>
              <th>Role</th>
              <th>Status</th>
              <th>Check-in Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-slate-50">
                <td className="py-2 font-medium text-slate-900">
                  {r.first_name} {r.last_name}
                </td>
                <td className="text-slate-600">{r.organisation}</td>
                <td className="text-slate-600">{ROLE_LABELS[r.role]}</td>
                <td>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      r.attendance_status === "checked_in"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {r.attendance_status === "checked_in" ? "Checked in" : "Pending"}
                  </span>
                </td>
                <td className="text-slate-500">
                  {r.check_in_time ? new Date(r.check_in_time).toLocaleTimeString() : "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No matching participants.
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
      <div className="text-3xl font-extrabold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}
