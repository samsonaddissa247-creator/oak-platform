"use client";

import { useEffect, useState } from "react";
import { Participant } from "./types";

// Reads the participant stashed in sessionStorage at registration time.
// This is a lightweight prototype mechanism — swap for real Supabase Auth
// sessions before this goes to production, especially for the Coordination
// Team role, which needs a proper login (see brief: "admin authentication").
export function useParticipant() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("oak_participant");
    if (raw) setParticipant(JSON.parse(raw));
    setLoaded(true);
  }, []);

  return { participant, role: participant?.role ?? null, loaded };
}
