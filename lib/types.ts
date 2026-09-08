export type UserRole =
  | "partner"
  | "oak_staff"
  | "coordination_team"
  | "presenter"
  | "observer";

export const ROLE_LABELS: Record<UserRole, string> = {
  partner: "Partner",
  oak_staff: "OAK Staff",
  coordination_team: "Coordination Team",
  presenter: "Presenter",
  observer: "Observer",
};

// Where each role lands right after registering
export const ROLE_LANDING: Record<UserRole, string> = {
  partner: "/qr-code",
  oak_staff: "/dashboard",
  presenter: "/dashboard",
  observer: "/dashboard",
  coordination_team: "/dashboard/coordination",
};

// Page access matrix, mirrors the spec exactly
export const ACCESS_MATRIX: Record<string, UserRole[]> = {
  registration: ["partner", "oak_staff", "presenter", "observer", "coordination_team"],
  qr_code_page: ["partner"],
  program_page: ["oak_staff", "presenter", "observer", "coordination_team"],
  partners_page: ["oak_staff", "presenter", "observer", "coordination_team"],
  check_in_page: ["coordination_team"],
  attendance_page: ["coordination_team"],
};

export function canAccess(page: keyof typeof ACCESS_MATRIX, role: UserRole | null) {
  if (!role) return false;
  return ACCESS_MATRIX[page].includes(role);
}

export interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  organisation: string;
  sub_partner: string | null;
  role: UserRole;
  email: string;
  phone: string | null;
  dietary_requirements: string | null;
  accessibility_requirements: string | null;
  travel_requirements: string | null;
  accommodation_requirements: string | null;
  registration_id: string;
  registration_date: string;
  registration_status: "registered" | "cancelled";
  qr_code_id: string | null;
  attendance_status: "not_checked_in" | "checked_in";
  check_in_time: string | null;
  check_in_date: string | null;
}

export interface RegistrationInput {
  first_name: string;
  last_name: string;
  organisation: string;
  sub_partner?: string;
  role: UserRole;
  email: string;
  phone?: string;
  dietary_requirements?: string;
  accessibility_requirements?: string;
  travel_requirements?: string;
  accommodation_requirements?: string;
  consent: boolean;
}
