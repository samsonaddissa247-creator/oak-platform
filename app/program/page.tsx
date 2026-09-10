"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown, Clock3, Download, FileText, MapPin, Star } from "lucide-react";

const SCHEDULE = [
  {
    day: "Day 1",
    date: "9 Nov",
    sessions: [
      { time: "09:00–10:30", title: "Opening Plenary: Pathways to Impact", speaker: "Dr. Helena Moreau · OAK Foundation", venue: "Main Hall A", type: "Plenary" },
      { time: "10:50–12:00", title: "Thematic Dialogue: Climate Justice & Grantmaking", speaker: "Samuel Okafor · Africa Climate Alliance", venue: "Conference Room B2", type: "Breakout" },
      { time: "18:00–20:00", title: "Welcome Reception & Dinner", speaker: "", venue: "Rooftop Terrace", type: "Social" },
    ],
  },
  { day: "Day 2", date: "10 Nov", sessions: [] },
  { day: "Day 3", date: "11 Nov", sessions: [] },
];

export default function ProgramPage() {
  const [activeDay, setActiveDay] = useState(0);
  const [view, setView] = useState<"schedule" | "docs">("schedule");
  const [notes, setNotes] = useState<Record<string, string>>({});

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-3 py-5 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Programme</h1>
        <p className="text-sm text-slate-500">OAK Partner Convening 2026</p>
      </div>

      <div className="flex rounded-lg bg-slate-200/70 p-1 text-xs font-semibold">
        <button onClick={() => setView("schedule")} className={`flex-1 rounded-md px-3 py-2 ${view === "schedule" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
          Schedule
        </button>
        <button onClick={() => setView("docs")} className={`flex-1 rounded-md px-3 py-2 ${view === "docs" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
          Docs
        </button>
      </div>

      {view === "docs" ? <DocsView /> : <>

      <div className="flex flex-wrap gap-3">
        {SCHEDULE.map((d, i) => (
          <button
            key={d.day}
            onClick={() => setActiveDay(i)}
            className={`flex-1 rounded-2xl px-4 py-3 text-left ${
              activeDay === i ? "bg-[#0f1f3d] text-white" : "bg-white text-slate-700"
            }`}
          >
            <CalendarDays aria-hidden="true" className="mb-2 h-4 w-4 opacity-80" />
            <div className="text-xs uppercase opacity-70">{d.day.split(" ")[0]}</div>
            <div className="font-bold">{d.day}</div>
            <div className="text-xs opacity-70">{d.date}</div>
          </button>
        ))}
      </div>

      <section className="rounded-2xl bg-[#162e55] p-5 text-white shadow-sm sm:p-6">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-200">
          <Star className="h-3 w-3" /> Featured · 09:00–10:30
        </p>
        <p className="mt-2 text-lg font-extrabold">Opening Plenary: Pathways to Impact</p>
        <p className="mt-1 text-sm text-blue-100">Dr. Helena Moreau · OAK Foundation</p>
        <p className="mt-2 flex items-center gap-1 text-xs text-blue-200"><MapPin className="h-3 w-3" /> Main Hall A</p>
      </section>

      <div className="flex flex-wrap gap-3 text-[10px] text-slate-400"><span className="text-[#294a80]">● Plenary</span><span className="text-amber-500">● Breakout</span><span className="text-violet-500">● Workshop</span><span className="text-orange-500">● Social</span></div>

      <div className="space-y-2 text-[10px] text-slate-400">
        <div className="flex items-center gap-3"><span className="font-mono">08:00</span><span className="h-px flex-1 bg-slate-200" /><span>Registration &amp; Welcome Coffee</span></div>
        <div className="flex items-center gap-3"><span className="font-mono">10:30</span><span className="h-px flex-1 bg-slate-200" /><span>Coffee Break</span></div>
      </div>

      <div className="space-y-3">
        {SCHEDULE[activeDay].sessions.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-8">
            Schedule for this day hasn&apos;t been published yet.
          </p>
        )}
        {SCHEDULE[activeDay].sessions.map((s, idx) => {
          const sessionId = `${activeDay}-${idx}`;
          return (
            <div key={sessionId} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1 text-xs font-mono text-slate-500"><Clock3 className="h-3 w-3" />{s.time}</p>
                  <p className="mt-1 font-bold text-slate-900">{s.title}</p>
                  {s.speaker && <p className="text-sm text-slate-500">{s.speaker}</p>}
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <MapPin aria-hidden="true" className="h-3 w-3" />
                    {s.venue}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
                  {s.type}<ChevronDown className="h-3 w-3" />
                </span>
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
      </>}
    </div>
  );
}

function DocsView() {
  const notes = [
    "The rights-based approaches session surfaced strong demand for a shared learning platform.",
    "Digital rights breakout participants want a working group to share tools.",
    "Strategic communications workshop needs a follow-up toolkit.",
  ];
  return <div className="space-y-4"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-sm font-bold text-slate-800"><FileText className="h-4 w-4" /> Session Notes</h2><button className="rounded-lg bg-[#162e55] px-3 py-2 text-[10px] font-semibold text-white">+ Add Note</button></div>{notes.map((note, index) => <div key={note} className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-sm leading-6 text-slate-700">{note}</p><p className="mt-2 text-[10px] text-slate-400">Day {index + 1} · 14:32</p></div>)}<ReferenceSections /></div>;
}

function ReferenceSections() {
  const takeaways = ["Philanthropy needs to accept 10+ year time horizons for systemic change", "Shared learning infrastructure is the most requested resource across the portfolio", "Digital rights must be integrated into all programme areas, not siloed"];
  return <div className="space-y-4">
    <section><h2 className="mb-3 text-sm font-bold text-slate-800">Photo Gallery</h2><div className="grid grid-cols-2 gap-2">{["Audience", "Speaker", "Workshop", "Venue", "Discussion", "Attendee"].map((photo) => <div key={photo} className="flex aspect-[4/3] items-end rounded-xl bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400 p-2 text-[10px] font-semibold text-white shadow-inner">{photo}</div>)}</div></section>
    <section><h2 className="mb-3 text-sm font-bold text-slate-800">Key Takeaways</h2><div className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">{takeaways.map((item, index) => <p key={item} className="flex gap-2 text-xs leading-5 text-slate-600"><span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#162e55] text-[9px] text-white">{index + 1}</span>{item}</p>)}</div></section>
    <section><h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800"><Download className="h-4 w-4" /> Resources</h2><div className="space-y-2">{["Opening Plenary Presentation", "OAK Portfolio Overview 2024–26", "Action Planning Workbook"].map((item) => <button key={item} className="flex w-full items-center justify-between rounded-xl bg-white p-3 text-left text-xs font-semibold text-slate-700 shadow-sm"><span className="flex items-center gap-2"><FileText className="h-4 w-4 text-slate-400" />{item}</span><Download className="h-3 w-3 text-slate-400" /></button>)}</div></section>
  </div>;
}
