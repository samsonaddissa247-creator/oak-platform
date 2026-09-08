"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole, canAccess } from "@/lib/types";

const NAV_ITEMS: { href: string; label: string; page: string; icon: string }[] = [
  { href: "/register", label: "Register", page: "registration", icon: "👤" },
  { href: "/qr-code", label: "QR Code", page: "qr_code_page", icon: "▦" },
  { href: "/program", label: "Programme", page: "program_page", icon: "📅" },
  { href: "/partners", label: "Partners", page: "partners_page", icon: "🌐" },
  { href: "/check-in", label: "Check In", page: "check_in_page", icon: "⌗" },
  { href: "/attendance", label: "Attendance", page: "attendance_page", icon: "▤" },
];

export default function Sidebar({ role }: { role: UserRole | null }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white min-h-screen px-4 py-6">
      <div className="mb-8 px-2">
        <div className="text-xl font-extrabold tracking-tight text-slate-900">OAK</div>
        <div className="text-xs uppercase tracking-wide text-slate-500 mt-1">
          Partner Convening 2026
        </div>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.filter((item) => canAccess(item.page as any, role)).map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#0f1f3d] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="w-4 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4 px-2 text-xs text-slate-500">
        <div className="font-medium text-slate-700">Harare, Zimbabwe</div>
        <div>9–11 November 2026</div>
      </div>
    </aside>
  );
}
