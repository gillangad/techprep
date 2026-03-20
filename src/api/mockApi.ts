import type { Activity, DailyChallenge, LeaderboardUser, Question } from "../types";

const API_BASE = import.meta.env.PROD ? "/api" : "http://localhost:3001";

export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch(`${API_BASE}/questions`);
  return res.json();
}

export async function fetchLeaderboard(): Promise<LeaderboardUser[]> {
  const res = await fetch(`${API_BASE}/leaderboard`);
  return res.json();
}

export async function fetchActivities(): Promise<Activity[]> {
  const res = await fetch(`${API_BASE}/activities`);
  return res.json();
}

export async function fetchDailyChallenge(): Promise<DailyChallenge> {
  const res = await fetch(`${API_BASE}/daily-challenge`);
  const data: DailyChallenge[] = await res.json();
  const dayIndex = new Date().getDate() % data.length;
  return data[dayIndex];
}
