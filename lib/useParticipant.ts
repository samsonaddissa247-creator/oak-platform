"use client";

import { useEffect, useState } from "react";
import { Participant } from "./types";

export function useParticipant() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = window.sessionStorage.getItem("oak_participant");
    setParticipant(raw ? (JSON.parse(raw) as Participant) : null);
    setLoaded(true);
  }, []);

  return { participant, role: participant?.role ?? null, loaded };
}
