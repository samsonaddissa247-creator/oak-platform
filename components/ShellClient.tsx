"use client";

import { useParticipant } from "@/lib/useParticipant";
import Sidebar from "./Sidebar";

export default function ShellClient({ children }: { children: React.ReactNode }) {
  const { role } = useParticipant();

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <main className="flex-1 flex">{children}</main>
    </div>
  );
}
