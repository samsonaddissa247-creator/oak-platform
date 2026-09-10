"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CalendarDays, ClipboardCheck, LayoutGrid, UserRound, UsersRound, type LucideIcon } from "lucide-react";
import { ACCESS_MATRIX, UserRole, canAccess } from "@/lib/types";

const NAV_ITEMS: { href: string; label: string; page: keyof typeof ACCESS_MATRIX; icon: LucideIcon }[] = [
  { href: "/register", label: "Register", page: "registration", icon: UserRound },
  { href: "/check-in", label: "Check In", page: "check_in_page", icon: ClipboardCheck },
  { href: "/program", label: "Programme", page: "program_page", icon: CalendarDays },
  { href: "/partners", label: "Partners", page: "partners_page", icon: LayoutGrid },
  { href: "/attendance", label: "Attendance", page: "attendance_page", icon: UsersRound },
];

export default function Sidebar({ role }: { role: UserRole | null }) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-slate-200 bg-white px-3 py-4 md:sticky md:top-0 md:min-h-screen md:w-52 md:shrink-0 md:border-b-0 md:border-r md:px-4 md:py-6">
      <div className="-mx-3 mb-4 flex h-[82px] items-center gap-3 bg-[#162e55] px-8 md:hidden">
        <div className="relative h-8 w-[58px] shrink-0 overflow-hidden">
          <Image
            src="/oak-removebg-preview.png"
            alt="OAK Foundation"
            width={180}
            height={90}
            className="absolute left-[-18px] top-[-20px] max-w-none brightness-0 invert"
          />
        </div>
        <span className="h-7 w-px bg-[#91a4c4]/40" aria-hidden="true" />
        <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b9c4d8]">
          Partner Convening 2026
        </span>
      </div>

      <div className="mb-4 hidden px-2 md:mb-8 md:block">
        <Image
          src="/oak-removebg-preview.png"
          alt="OAK Foundation Partner Convening 2026"
          width={150}
          height={58}
          className="h-auto w-full max-w-[150px]"
          priority
        />
      </div>

      <nav className="flex flex-wrap gap-2 md:block md:space-y-1">
        {NAV_ITEMS.filter((item) => role === null
          ? item.page === "registration"
          : canAccess(item.page, role)
        ).map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[calc(50%-0.25rem)] flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition sm:min-w-0 sm:flex-none md:w-full ${
                active
                  ? "bg-[#0f1f3d] text-white shadow-[0_6px_14px_rgba(15,31,61,0.18)]"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 px-2 text-xs text-slate-500 md:absolute md:bottom-6 md:left-4 md:right-4 md:mt-0">
        <div className="font-medium text-slate-700">Harare, Zimbabwe</div>
        <div>9–11 November 2026</div>
      </div>
    </aside>
  );
}
