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
    <div className="mx-auto w-full max-w-3xl px-2.5 py-3 sm:px-6 sm:py-8">
      <div className="mb-2.5 rounded-xl bg-[#162e55] p-3.5 text-white shadow-sm sm:mb-3 sm:rounded-2xl sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
          OAK Foundation
        </p>
        <div className="mt-1.5 flex flex-col justify-between gap-2 sm:mt-2 sm:flex-row sm:items-end sm:gap-3">
          <div>
            <h1 className="text-[21px] font-extrabold leading-tight sm:text-3xl">Partner Convening 2026</h1>
            <p className="mt-1 text-xs text-blue-100 sm:text-sm">Harare · 9–11 November 2026</p>
          </div>
          <span className="hidden w-fit rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-blue-100 sm:inline-block sm:px-3 sm:text-xs">
            Registration open
          </span>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-1.5 sm:mb-5 sm:gap-3">
        <EventStat icon={UsersRound} value="110+" label="Attendees" />
        <EventStat icon={CalendarDays} value="24" label="Sessions" />
        <EventStat icon={Layers3} value="38" label="Partners" />
      </div>

      <form onSubmit={handleSubmit} className="register-form space-y-3 rounded-xl bg-white p-2.5 shadow-sm sm:space-y-5 sm:rounded-2xl sm:p-6">
        <div className="border-b border-slate-100 pb-2.5 sm:pb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Event access
          </p>
          <h2 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">Registration Form</h2>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <Field label="First Name" required>
            <input
              required
              className="input text-xs sm:text-sm"
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
            />
          </Field>
          <Field label="Last Name" required>
            <input
              required
              className="input text-xs sm:text-sm"
              value={form.last_name}
              onChange={(e) => update("last_name", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Organisation" required>
          <input
            required
            className="input text-xs sm:text-sm"
            value={form.organisation}
            onChange={(e) => update("organisation", e.target.value)}
          />
        </Field>

        <Field label="Sub-Partner / Programme Area">
          <input
            className="input text-xs sm:text-sm"
            placeholder="Optional"
            value={form.sub_partner}
            onChange={(e) => update("sub_partner", e.target.value)}
          />
        </Field>

        <Field label="Role / Capacity" required>
          <select
            required
            className="input text-xs sm:text-sm"
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

        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <Field label="Email Address" required>
            <input
              required
              type="email"
              className="input text-xs sm:text-sm"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </Field>
          <Field label="Phone Number">
            <input
              className="input text-xs sm:text-sm"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
        </div>

        <div className="space-y-2.5 rounded-lg border border-slate-200 bg-slate-50 p-2.5 sm:space-y-4 sm:rounded-xl sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Requirements
          </p>
          <Field label="Dietary Requirements">
            <textarea
              className="input text-xs sm:text-sm"
              rows={2}
              placeholder="e.g. Vegetarian, Halal, Gluten-free"
              value={form.dietary_requirements}
              onChange={(e) => update("dietary_requirements", e.target.value)}
            />
          </Field>
          <Field label="Accessibility Requirements">
            <textarea
              className="input text-xs sm:text-sm"
              rows={2}
              placeholder="e.g. Wheelchair access, hearing loop"
              value={form.accessibility_requirements}
              onChange={(e) => update("accessibility_requirements", e.target.value)}
            />
          </Field>
          <Field label="Travel & Accommodation">
            <textarea
              className="input text-xs sm:text-sm"
              rows={2}
              placeholder="e.g. Flight from London, hotel needed"
              value={form.travel_requirements}
              onChange={(e) => update("travel_requirements", e.target.value)}
            />
          </Field>
          <Field label="Accommodation Requirements">
            <textarea
              className="input text-xs sm:text-sm"
              rows={2}
              placeholder="e.g. Single room, 2 nights"
              value={form.accommodation_requirements}
              onChange={(e) => update("accommodation_requirements", e.target.value)}
            />
          </Field>
        </div>

        <label className="flex items-start gap-2 rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] leading-tight text-slate-600 sm:gap-3 sm:rounded-xl sm:px-3 sm:py-3 sm:text-sm">
          <input
            type="checkbox"
            className="mt-0.5"
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
          className="w-full rounded-lg bg-[#162e55] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f1f3d] disabled:opacity-60 sm:rounded-xl sm:py-3.5"
        >
          {submitting ? "Registering…" : "Register"}
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
    <div className="rounded-lg bg-white p-2.5 shadow-sm sm:rounded-xl sm:p-4">
      <Icon aria-hidden="true" className="h-4 w-4 text-[#7894bc]" strokeWidth={1.8} />
      <p className="mt-1.5 text-base font-extrabold leading-none text-[#162e55] sm:mt-2 sm:text-xl">{value}</p>
      <p className="mt-1 text-[9px] uppercase tracking-wide text-slate-400 sm:text-[10px]">{label}</p>
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
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
