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

export default function AttendancePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/attendance")
      .then((r) => r.json())
      .then((d) => {
        setRows(d.participants || []);
        setStats(d.stats);
      });
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
    <div className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Attendance</h1>
        <p className="text-slate-500 text-sm">Check-in tracking · 9–11 November 2026</p>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-4">
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
          <div className="grid grid-cols-5 gap-3 text-center">
            {Object.entries(ROLE_LABELS).map(([key, label]) => (
              <div key={key} className="bg-slate-50 rounded-xl py-3">
                <div className="text-xl font-bold text-slate-900">
                  {stats.roleBreakdown[key] || 0}
                </div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex gap-3">
          <input
            className="input flex-1"
            placeholder="Search name or organisation…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input w-40" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All roles</option>
            {Object.entries(ROLE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="input w-44"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="checked_in">Checked in</option>
            <option value="not_checked_in">Pending</option>
          </select>
        </div>

        <table className="w-full text-sm">
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
                <td colSpan={5} className="text-center text-slate-400 py-8">
                  No matching participants.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
