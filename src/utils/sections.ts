import { Binary, Cpu, Database, LayoutList, Network } from "lucide-react";
import type { ComponentType } from "react";
import type { Section } from "../types";

type SectionMetadata = {
  name: string;
  navLabel: string;
  collectionLabel: string;
  icon: ComponentType<{ className?: string }>;
};

export const SECTION_META: Record<Section, SectionMetadata> = {
  dsa: {
    name: "DSA",
    navLabel: "DSA Interview Questions",
    collectionLabel: "DSA Interview Questions",
    icon: Binary,
  },
  sql: {
    name: "SQL",
    navLabel: "SQL Interview Questions",
    collectionLabel: "SQL Interview Questions",
    icon: Database,
  },
  "core-cs": {
    name: "Core CS",
    navLabel: "Core CS Interview Questions",
    collectionLabel: "Core CS Interview Questions",
    icon: Cpu,
  },
  "system-design": {
    name: "System Design",
    navLabel: "System Design",
    collectionLabel: "System Design",
    icon: Network,
  },
  all: {
    name: "All",
    navLabel: "All Interview Questions",
    collectionLabel: "All Interview Questions",
    icon: LayoutList,
  },
};

export const PRACTICE_SECTIONS = ["dsa", "sql", "core-cs", "system-design"] as const;

export function getSectionName(section: string) {
  const metadata = SECTION_META[section as Section];
  if (metadata) {
    return metadata.name;
  }

  return section
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const SYSTEM_DESIGN_QUESTION_LABELS: Record<string, string> = {
  "system-1": "Mock Question 1",
  "system-3": "Mock Question 2",
  "system-5": "Mock Question 3",
  "dc-4": "Mock Question 4",
};

export function isSystemDesignSection(section: string) {
  return section === "system-design";
}

export function getQuestionDisplayTitle(section: string, id: string, title: string) {
  if (isSystemDesignSection(section)) {
    return SYSTEM_DESIGN_QUESTION_LABELS[id] ?? "Mock Question";
  }

  return title;
}
