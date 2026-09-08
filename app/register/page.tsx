"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      // Stash the participant so the next page can render without re-fetching
      sessionStorage.setItem("oak_participant", JSON.stringify(data.participant));
      router.push(data.redirectTo);
    } catch {
      setError("Network error — please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
      <div className="rounded-2xl bg-[#0f1f3d] text-white p-8 mb-6">
        <h1 className="text-3xl font-extrabold">Partner Convening 2026</h1>
        <p className="text-slate-300 mt-1">Harare · 9–11 Nov 2026</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Registration Form</h2>

        <div className="grid grid-cols-2 gap-4">
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

        <div className="grid grid-cols-2 gap-4">
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

        <div className="bg-slate-50 rounded-xl p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
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

        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
          />
          I agree to OAK Foundation's privacy policy and consent to my registration
          data being used for event coordination.
        </label>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[#0f1f3d] text-white font-semibold py-3 disabled:opacity-60"
        >
          {submitting ? "Registering…" : "Register"}
        </button>
      </form>
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
