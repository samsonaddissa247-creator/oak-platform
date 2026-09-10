"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { CalendarDays, CheckCircle2, Download, MapPin, QrCode } from "lucide-react";
import { Participant } from "@/lib/types";

export default function QrCodePage() {
  const [participant] = useState<Participant | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem("oak_participant");
    return raw ? (JSON.parse(raw) as Participant) : null;
  });

  if (!participant) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl items-center justify-center px-4 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <QrCode aria-hidden="true" className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 font-semibold text-slate-800">No registration found</p>
          <p className="mt-1 text-sm text-slate-500">Please register before opening your QR code.</p>
        </div>
      </div>
    );
  }

  function downloadQr() {
    const canvas = document.getElementById("participant-qr") as HTMLCanvasElement | null;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${participant!.registration_id}-qr.png`;
    link.click();
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-3 py-5 sm:px-6 sm:py-8">
      <div className="relative overflow-hidden rounded-2xl bg-[#162e55] p-5 text-white shadow-sm sm:p-6">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-lg font-bold">
            {participant.first_name[0]}{participant.last_name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-200">
              Registration Complete
            </p>
            <h1 className="mt-1 truncate text-xl font-extrabold sm:text-2xl">
              {participant.first_name} {participant.last_name}
            </h1>
            <p className="truncate text-sm text-blue-100">{participant.organisation}</p>
          </div>
        </div>
        <div className="relative mt-5 flex items-center gap-2 text-xs text-blue-100">
          <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
          Your event entry pass is ready
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 text-center shadow-sm sm:p-6">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          <QrCode aria-hidden="true" className="h-4 w-4" />
          Your Entry Pass
        </div>
        <div className="mx-auto mt-4 inline-block max-w-full rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-6">
          <QRCodeCanvas
            id="participant-qr"
            value={participant.qr_code_id ?? ""}
            size={220}
            className="h-auto max-w-full"
          />
        </div>
        <p className="mt-4 break-all font-mono text-xs text-slate-600">{participant.qr_code_id}</p>
        <p className="mt-1 text-sm text-slate-500">Present at event entrance for check-in</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Event Details</p>
        <dl className="divide-y divide-slate-100 text-sm">
          <Row icon={CalendarDays} label="Event Dates" value={process.env.NEXT_PUBLIC_EVENT_DATES || "9–11 November 2026"} />
          <Row icon={MapPin} label="Venue" value={process.env.NEXT_PUBLIC_EVENT_VENUE || "Cresta Lodge, Msasa, Harare"} />
          <Row label="Name" value={`${participant.first_name} ${participant.last_name}`} />
          <Row label="Organisation" value={participant.organisation} />
          <Row label="Role" value={participant.role.replace("_", " ")} />
          <Row label="Email" value={participant.email} />
          <Row label="Registration ID" value={participant.registration_id} />
        </dl>
      </div>

      <button
        onClick={downloadQr}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#162e55] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f1f3d]"
      >
        <Download aria-hidden="true" className="h-4 w-4" />
        Download QR Code
      </button>
      <a href="/register" className="block text-center text-sm text-slate-400 transition hover:text-[#162e55]">
        ↻ Register another attendee
      </a>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon?: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="flex items-center gap-2 text-slate-500">
        {Icon && <Icon aria-hidden="true" className="h-4 w-4 text-slate-400" />}
        {label}
      </span>
      <span className="break-words font-medium text-slate-900 sm:text-right">{value}</span>
    </div>
  );
}
