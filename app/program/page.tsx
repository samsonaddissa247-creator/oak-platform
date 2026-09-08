"use client";

import { useState } from "react";

// Placeholder schedule — replace with a `sessions` table + Supabase query
// once the programme content is finalised.
const SCHEDULE = [
  {
    day: "Day 1",
    date: "9 Nov",
    sessions: [
      { time: "09:00–10:30", title: "Opening Plenary: Pathways to Impact", speaker: "Dr. Helena Moreau · OAK Foundation", venue: "Main Hall A" },
      { time: "10:50–12:00", title: "Thematic Dialogue: Climate Justice & Grantmaking", speaker: "Samuel Okafor · Africa Climate Alliance", venue: "Conference Room B2" },
      { time: "18:00–20:00", title: "Welcome Reception & Dinner", speaker: "", venue: "Rooftop Terrace" },
    ],
  },
  { day: "Day 2", date: "10 Nov", sessions: [] },
  { day: "Day 3", date: "11 Nov", sessions: [] },
];

export default function ProgramPage() {
  const [activeDay, setActiveDay] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});

  return (
    <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Programme</h1>
        <p className="text-slate-500 text-sm">OAK Partner Convening 2026</p>
      </div>

      <div className="flex gap-3">
        {SCHEDULE.map((d, i) => (
          <button
            key={d.day}
            onClick={() => setActiveDay(i)}
            className={`flex-1 rounded-2xl px-4 py-3 text-left ${
              activeDay === i ? "bg-[#0f1f3d] text-white" : "bg-white text-slate-700"
            }`}
          >
            <div className="text-xs uppercase opacity-70">{d.day.split(" ")[0]}</div>
            <div className="font-bold">{d.day}</div>
            <div className="text-xs opacity-70">{d.date}</div>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {SCHEDULE[activeDay].sessions.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-8">
            Schedule for this day hasn't been published yet.
          </p>
        )}
        {SCHEDULE[activeDay].sessions.map((s, idx) => {
          const sessionId = `${activeDay}-${idx}`;
          return (
            <div key={sessionId} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs font-mono text-slate-500">{s.time}</p>
                  <p className="font-bold text-slate-900">{s.title}</p>
                  {s.speaker && <p className="text-sm text-slate-500">{s.speaker}</p>}
                  <p className="text-xs text-slate-400 mt-1">📍 {s.venue}</p>
                </div>
              </div>
              <textarea
                className="input mt-3 text-sm"
                rows={2}
                placeholder="Add a personal note for this session…"
                value={notes[sessionId] || ""}
                onChange={(e) => setNotes((n) => ({ ...n, [sessionId]: e.target.value }))}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
