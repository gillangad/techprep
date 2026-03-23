export type Plan = "free" | "pro" | "premium";

export type Section = "dsa" | "sql" | "core-cs" | "system-design" | "all";

export interface Question {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  section: Section;
  topic: string;
  status: "not-started" | "attempted" | "completed";
  lastAttemptedAt: string | null;
}

export interface TrackProgress {
  section: Section;
  label: string;
  completed: number;
  total: number;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  score: number;
  avatar: string;
}

export interface Activity {
  id: string;
  message: string;
  timestamp: string;
  type: "solved" | "completed-topic" | "streak" | "badge";
}

export interface DailyChallenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  section: Section;
  topic: string;
  completed: boolean;
}
