"use client";

import { useState } from "react";
import { Participant } from "./types";

export function useParticipant() {
  const [participant] = useState<Participant | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem("oak_participant");
    return raw ? (JSON.parse(raw) as Participant) : null;
  });

  return { participant, role: participant?.role ?? null, loaded: true };
}
