"use client";

import { useParticipant } from "@/lib/useParticipant";
import Sidebar from "./Sidebar";

export default function ShellClient({ children }: { children: React.ReactNode }) {
  const { role } = useParticipant();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar role={role} />
      <main className="flex-1 min-w-0 overflow-x-hidden px-3 py-4 sm:px-4 lg:px-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
