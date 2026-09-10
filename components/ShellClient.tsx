"use client";

import { useParticipant } from "@/lib/useParticipant";
import Sidebar from "./Sidebar";

export default function ShellClient({ children }: { children: React.ReactNode }) {
  const { role } = useParticipant();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar role={role} />
      <main className="min-w-0 flex-1 overflow-x-hidden px-3 py-4 sm:px-4 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
