"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Participant } from "@/lib/types";

export default function QrCodePage() {
  const [participant] = useState<Participant | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem("oak_participant");
    return raw ? (JSON.parse(raw) as Participant) : null;
  });

  if (!participant) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        No registration found for this session. Please register first.
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
    <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-[#0f1f3d] to-[#16305c] text-white p-8">
        <p className="text-xs uppercase tracking-wide text-slate-300">Registration Complete</p>
        <h1 className="text-3xl font-extrabold mt-1">
          You&apos;re Registered, {participant.first_name}!
        </h1>
        <p className="text-slate-300 mt-1">{participant.organisation}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-4">Your Entry Pass</p>
        <div className="inline-block bg-slate-50 rounded-xl p-6">
          <QRCodeCanvas id="participant-qr" value={participant.qr_code_id ?? ""} size={220} />
        </div>
        <p className="mt-4 font-mono text-sm text-slate-700">{participant.qr_code_id}</p>
        <p className="text-sm text-slate-500">Present at event entrance for check-in</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-3">Registration Details</p>
        <dl className="divide-y divide-slate-100 text-sm">
          <Row label="Name" value={`${participant.first_name} ${participant.last_name}`} />
          <Row label="Organisation" value={participant.organisation} />
          <Row label="Registration ID" value={participant.registration_id} />
          <Row
            label="Event Dates"
            value={process.env.NEXT_PUBLIC_EVENT_DATES || "9–11 November 2026"}
          />
          <Row
            label="Venue"
            value={process.env.NEXT_PUBLIC_EVENT_VENUE || "Cresta Lodge, Msasa, Harare"}
          />
        </dl>
      </div>

      <button
        onClick={downloadQr}
        className="w-full rounded-xl bg-[#0f1f3d] text-white font-semibold py-3"
      >
        Download QR Code
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2.5">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
