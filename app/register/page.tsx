"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Layers3, UsersRound } from "lucide-react";
import { UserRole, ROLE_LABELS } from "@/lib/types";

const ROLE_OPTIONS: UserRole[] = [
  "partner",
  "oak_staff",
  "coordination_team",
  "presenter",
  "observer",
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    organisation: "",
    sub_partner: "",
    role: "" as UserRole | "",
    email: "",
    phone: "",
    dietary_requirements: "",
    accessibility_requirements: "",
    travel_requirements: "",
    accommodation_requirements: "",
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.role) {
      setError("Please select your role.");
      return;
    }
    if (!form.consent) {
      setError("Please agree to the privacy policy to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      sessionStorage.setItem("oak_participant", JSON.stringify(data.participant));
      router.push(data.redirectTo);
    } catch {
      setError("Network error — please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-3 py-5 sm:px-6 sm:py-8">
      <div className="mb-3 rounded-2xl bg-[#162e55] p-5 text-white shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
          OAK Foundation
        </p>
        <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">Partner Convening 2026</h1>
            <p className="mt-1 text-sm text-blue-100">Harare · 9–11 March 2026</p>
          </div>
          <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-100">
            Registration open
          </span>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
        <EventStat icon={UsersRound} value="110+" label="Attendees" />
        <EventStat icon={CalendarDays} value="24" label="Sessions" />
        <EventStat icon={Layers3} value="38" label="Partners" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="border-b border-slate-100 pb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Event access
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">Registration Form</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First Name" required>
            <input
              required
              className="input"
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
            />
          </Field>
          <Field label="Last Name" required>
            <input
              required
              className="input"
              value={form.last_name}
              onChange={(e) => update("last_name", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Organisation" required>
          <input
            required
            className="input"
            value={form.organisation}
            onChange={(e) => update("organisation", e.target.value)}
          />
        </Field>

        <Field label="Sub-Partner / Programme Area">
          <input
            className="input"
            placeholder="Optional"
            value={form.sub_partner}
            onChange={(e) => update("sub_partner", e.target.value)}
          />
        </Field>

        <Field label="Role / Capacity" required>
          <select
            required
            className="input"
            value={form.role}
            onChange={(e) => update("role", e.target.value as UserRole)}
          >
            <option value="">Select your role</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email Address" required>
            <input
              required
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </Field>
          <Field label="Phone Number">
            <input
              className="input"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Requirements
          </p>
          <Field label="Dietary Requirements">
            <textarea
              className="input"
              rows={2}
              placeholder="e.g. Vegetarian, Halal, Gluten-free"
              value={form.dietary_requirements}
              onChange={(e) => update("dietary_requirements", e.target.value)}
            />
          </Field>
          <Field label="Accessibility Requirements">
            <textarea
              className="input"
              rows={2}
              placeholder="e.g. Wheelchair access, hearing loop"
              value={form.accessibility_requirements}
              onChange={(e) => update("accessibility_requirements", e.target.value)}
            />
          </Field>
          <Field label="Travel & Accommodation">
            <textarea
              className="input"
              rows={2}
              placeholder="e.g. Flight from London, hotel needed"
              value={form.travel_requirements}
              onChange={(e) => update("travel_requirements", e.target.value)}
            />
          </Field>
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-600">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
          />
          I agree to OAK Foundation&apos;s privacy policy and consent to my registration
          data being used for event coordination.
        </label>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[#162e55] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f1f3d] disabled:opacity-60"
        >
          {submitting ? "Registering…" : "Register & Generate QR Code"}
        </button>
      </form>
      <p className="mt-3 text-center text-[11px] text-slate-400">
        Your data is securely handled by OAK Foundation in accordance with GDPR.
      </p>
    </div>
  );
}

function EventStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof UsersRound;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm sm:p-4">
      <Icon aria-hidden="true" className="h-4 w-4 text-[#7894bc]" strokeWidth={1.8} />
      <p className="mt-2 text-lg font-extrabold leading-none text-[#162e55] sm:text-xl">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
