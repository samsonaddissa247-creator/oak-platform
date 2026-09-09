"use client";

import Sidebar from "./Sidebar";

export default function ShellClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden px-3 py-4 sm:px-4 lg:px-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
