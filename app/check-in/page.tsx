"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Activity, AlertTriangle, CheckCircle2, CircleX, MapPin, Phone, RefreshCw, ScanLine } from "lucide-react";
import { Participant } from "@/lib/types";

type ScanState =
  | { status: "idle" }
  | { status: "success"; participant: Participant }
  | { status: "error"; reason: string };

const REASON_COPY: Record<string, string> = {
  not_found: "Participant Not Found",
  duplicate: "Duplicate QR Code — already checked in today",
  invalid: "Invalid QR Code",
  network_error: "Network Error — please try again",
};

export default function CheckInPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [state, setState] = useState<ScanState>({ status: "idle" });
  const [manualCode, setManualCode] = useState("");
  const scanningRef = useRef(false);

  const handleScan = useCallback(async (qrCodeId: string) => {
    if (scanningRef.current) return;
    scanningRef.current = true;

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCodeId }),
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setState({ status: "error", reason: REASON_COPY[data.reason] || "Check-in failed" });
        return;
      }

      setState({ status: "success", participant: data.participant });
    } catch {
      setState({ status: "error", reason: REASON_COPY.network_error });
    } finally {
      scanningRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (state.status !== "idle") return;

    const el = document.getElementById("qr-reader");
    if (!el) return;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    let disposed = false;
    let started = false;

    const stopScanner = () => {
      if (!started) return;
      started = false;
      scanner.stop().catch(() => {});
    };

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          scanner.pause(true);
          handleScan(decodedText);
        },
        () => {}
      )
      .then(() => {
        started = true;
        if (disposed) stopScanner();
      })
      .catch(() => {
        if (!disposed) {
          setState({ status: "error", reason: "Camera unavailable — use manual entry below." });
        }
      });

    return () => {
      disposed = true;
      stopScanner();
      if (scannerRef.current === scanner) scannerRef.current = null;
    };
  }, [state.status, handleScan]);

  function reset() {
    setState({ status: "idle" });
    setManualCode("");
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-3 py-5 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Event Check-In</h1>
        <p className="text-sm text-slate-500">Scan an attendee QR code to check them in</p>
      </div>

      {state.status === "idle" && (
        <>
          <div id="qr-reader" className="rounded-2xl overflow-hidden bg-slate-900 aspect-square" />

          <div className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Manual Code Entry
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                className="input flex-1"
                placeholder="OAK-2026-XXXX-XXXX"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
              />
              <button
                onClick={() => manualCode && handleScan(manualCode)}
                className="rounded-xl bg-[#0f1f3d] text-white font-semibold px-6"
              >
                Check
              </button>
            </div>
          </div>
        </>
      )}

      {state.status === "success" && (
        <SuccessCard participant={state.participant} onNext={reset} />
      )}

      {state.status === "error" && <ErrorCard reason={state.reason} onRetry={reset} />}
    </div>
  );
}

function SuccessCard({
  participant,
  onNext,
}: {
  participant: Participant;
  onNext: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 p-5 text-white shadow-sm sm:p-6">
        <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-extrabold">Checked In Successfully</p>
            <p className="mt-1 text-sm text-emerald-50">
              {participant.check_in_time && new Date(participant.check_in_time).toLocaleTimeString()} · 9 November 2026
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#162e55] text-sm font-bold text-white">
            {participant.first_name[0]}{participant.last_name[0]}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900">{participant.first_name} {participant.last_name}</p>
            <p className="truncate text-sm text-slate-500">{participant.organisation}</p>
            <span className="mt-1 inline-block rounded-full bg-[#eef2f7] px-2 py-0.5 text-[10px] font-semibold text-[#162e55]">
              {participant.role.replace("_", " ")}
            </span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <InfoTile icon={Activity} label="Next Session" value="Opening Plenary" />
          <InfoTile icon={MapPin} label="Venue" value="Main Hall A" />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          <Activity aria-hidden="true" className="h-3 w-3" />
          Live Event Status
        </p>
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Opening Plenary starting at 09:30
        </p>
        <p className="mt-1 text-xs text-slate-400">74 of 110 attendees checked in · Main Hall A</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-[67%] rounded-full bg-[#294a80]" />
        </div>
      </div>

      <button
        onClick={onNext}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#162e55] py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#0f1f3d]"
      >
        <ScanLine aria-hidden="true" className="h-4 w-4" />
        Scan Next Attendee
      </button>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#eef2f7] p-3">
      <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        <Icon aria-hidden="true" className="h-3 w-3" />
        {label}
      </p>
      <p className="mt-1 text-xs font-bold text-slate-700">{value}</p>
    </div>
  );
}

function ErrorCard({ reason, onRetry }: { reason: string; onRetry: () => void }) {
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#ef292f] to-[#f84a50] p-5 text-white shadow-sm sm:p-6">
        <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <CircleX aria-hidden="true" className="h-6 w-6" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-100">
              Check-In Failed
            </p>
            <p className="mt-1 text-lg font-extrabold leading-tight">QR Code Not Recognized</p>
            <p className="mt-1 text-sm text-red-100">{reason === "Network Error — please try again" ? reason : "Code is invalid or unregistered"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <AlertTriangle aria-hidden="true" className="h-4 w-4 text-[#ef6268]" />
          Possible reasons
        </div>
        <ul className="mt-3 space-y-2 text-sm text-slate-500">
          {[
            "QR code belongs to a different event",
            "Registration was not completed",
            "Code has been altered or corrupted",
            "Attendee registered under a different email",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#ffb8bc]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onRetry}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#162e55] py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#0f1f3d]"
      >
        <RefreshCw aria-hidden="true" className="h-4 w-4" />
        Try Again
      </button>

      <a
        href="mailto:coordination@oakfoundation.org"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <Phone aria-hidden="true" className="h-4 w-4" />
        Contact Coordination Team
      </a>
    </div>
  );
}
