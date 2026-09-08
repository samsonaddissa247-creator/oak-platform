"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
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
  const [scanning, setScanning] = useState(false);

  async function handleScan(qrCodeId: string) {
    if (scanning) return;
    setScanning(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCodeId }),
      });
      const data = await res.json();
      if (data.ok) {
        setState({ status: "success", participant: data.participant });
      } else {
        setState({ status: "error", reason: REASON_COPY[data.reason] || "Check-in failed" });
      }
    } catch {
      setState({ status: "error", reason: REASON_COPY.network_error });
    } finally {
      setScanning(false);
    }
  }

  useEffect(() => {
    if (state.status !== "idle") return; // pause camera while a result is shown

    const el = document.getElementById("qr-reader");
    if (!el) return;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          scanner.pause(true);
          handleScan(decodedText);
        },
        () => {} // ignore per-frame scan failures
      )
      .catch(() => {
        setState({ status: "error", reason: "Camera unavailable — use manual entry below." });
      });

    return () => {
      scanner.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  function reset() {
    setState({ status: "idle" });
    setManualCode("");
  }

  return (
    <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Event Check-In</h1>
        <p className="text-slate-500 text-sm">Scan an attendee QR code to check them in</p>
      </div>

      {state.status === "idle" && (
        <>
          <div id="qr-reader" className="rounded-2xl overflow-hidden bg-slate-900 aspect-square" />

          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Manual Code Entry
            </p>
            <div className="flex gap-2">
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
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6">
        <p className="font-bold text-lg">Checked In Successfully</p>
        <p className="text-emerald-50 text-sm">
          {participant.check_in_time && new Date(participant.check_in_time).toLocaleTimeString()}
        </p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-1">
        <p className="font-bold text-slate-900">
          {participant.first_name} {participant.last_name}
        </p>
        <p className="text-slate-500 text-sm">{participant.organisation}</p>
        <span className="inline-block mt-2 text-xs font-medium bg-slate-100 rounded-full px-3 py-1">
          {participant.role.replace("_", " ")}
        </span>
      </div>
      <button
        onClick={onNext}
        className="w-full rounded-xl bg-[#0f1f3d] text-white font-semibold py-3"
      >
        Scan Next Attendee
      </button>
    </div>
  );
}

function ErrorCard({ reason, onRetry }: { reason: string; onRetry: () => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
        <p className="text-xs uppercase tracking-wide text-red-100">Check-In Failed</p>
        <p className="font-bold text-lg">QR Code Not Recognized</p>
        <p className="text-red-100 text-sm">{reason}</p>
      </div>
      <button
        onClick={onRetry}
        className="w-full rounded-xl bg-[#0f1f3d] text-white font-semibold py-3"
      >
        Retry Scan
      </button>
      <button
        onClick={onRetry}
        className="w-full rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold py-3"
      >
        Return to Scanner
      </button>
    </div>
  );
}
