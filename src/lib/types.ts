export type HackathonStatus = "Live" | "Upcoming" | "Completed";

export const PAGE_SIZE = 25;

export type SortField = "end_time" | "prize_amount" | "start_time";
export type SortOrder = "asc" | "desc";

// Structured journal stored as JSON in the journal column
export interface JournalData {
  goal: string;
  approach: string;
  challenges: string;
  outcome: string;
  retrospective: string;
}

export interface Hackathon {
  id: string;
  title: string;
  url: string;
  project_name: string | null;
  prize_display: string | null;
  prize_amount: number | null;
  tags: string[] | null;
  priority: string | null;
  github_repo: string | null;
  registration_deadline: string | null;
  start_time: string;
  end_time: string;
  journal: string | null; // JSON string of JournalData
  learning: string | null;
  achievement: string | null;
  created_at: string;
  updated_at: string;
}

export interface HackathonView extends Hackathon {
  status: HackathonStatus;
}

export interface Site {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

export interface HackathonFormData {
  title: string;
  url: string;
  project_name: string;
  prize_display: string;
  prize_amount: string;
  tags: string;
  priority: string;
  github_repo: string;
  registration_deadline: string;
  start_time: string;
  end_time: string;
  achievement: string;
  learning: string;
  // journal fields
  goal: string;
  approach: string;
  challenges: string;
  outcome: string;
  retrospective: string;
}

export interface SiteFormData {
  name: string;
  url: string;
}

export interface QueryResult<T> {
  data: T[];
  count: number;
  error: string | null;
}

// Calendar event types
export type CalendarEventType = "registration" | "start" | "end";

export interface CalendarEvent {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
  date: string; // ISO date string
  type: CalendarEventType;
}
