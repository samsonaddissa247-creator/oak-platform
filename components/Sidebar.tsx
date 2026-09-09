"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCESS_MATRIX, UserRole, canAccess } from "@/lib/types";

const NAV_ITEMS: { href: string; label: string; page: keyof typeof ACCESS_MATRIX; icon: string }[] = [
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
    <aside className="border-b border-[#244578] bg-[#162e55] px-3 py-4 lg:sticky lg:top-0 lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:border-slate-200 lg:bg-white lg:px-4 lg:py-6">
      <div className="mb-4 px-2 lg:mb-8">
        <div className="text-xl font-extrabold tracking-tight text-white lg:text-slate-900">OAK</div>
        <div className="mt-1 text-xs uppercase tracking-wide text-blue-100 lg:text-slate-500">
          Partner Convening 2026
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 lg:block lg:space-y-1">
        {NAV_ITEMS.filter((item) => canAccess(item.page, role)).map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[calc(50%-0.25rem)] flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition sm:min-w-0 sm:flex-none lg:w-full ${
                active
                  ? "bg-white text-[#162e55] lg:bg-[#0f1f3d] lg:text-white"
                  : "text-blue-50 hover:bg-white/10 lg:text-slate-600 lg:hover:bg-slate-100"
              }`}
            >
              <span className="w-4 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 px-2 text-xs text-blue-100 lg:absolute lg:bottom-6 lg:left-4 lg:right-4 lg:mt-0 lg:text-slate-500">
        <div className="font-medium text-white lg:text-slate-700">Harare, Zimbabwe</div>
        <div>9–11 November 2026</div>
      </div>
    </aside>
  );
}
