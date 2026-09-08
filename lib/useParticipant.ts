"use client";

import { useState } from "react";
import { Participant } from "./types";

// Reads the participant stashed in sessionStorage at registration time.
// This is a lightweight prototype mechanism — swap for real Supabase Auth
// sessions before this goes to production, especially for the Coordination
// Team role, which needs a proper login (see brief: "admin authentication").
export function useParticipant() {
  const [participant] = useState<Participant | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem("oak_participant");
    return raw ? (JSON.parse(raw) as Participant) : null;
  });

  return { participant, role: participant?.role ?? null, loaded: true };
}
