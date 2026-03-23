import type { Plan, Section } from "../types";

export function canAccess(plan: Plan, section: Section): boolean {
  if (section === "dsa") return true;
  if (section === "system-design") return true;
  if (section === "sql") return plan === "pro" || plan === "premium";
  if (section === "all") return plan === "pro" || plan === "premium";
  if (section === "core-cs") return plan === "premium";
  return false;
}
