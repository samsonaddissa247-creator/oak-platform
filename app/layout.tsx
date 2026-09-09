import type { Metadata } from "next";
import "./globals.css";
import ShellClient from "@/components/ShellClient";

export const metadata: Metadata = {
  title: "OAK Foundation Partner Convening 2026",
  description: "Registration & Attendance Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <ShellClient>{children}</ShellClient>
      </body>
    </html>
  );
}
