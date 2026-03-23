import { Binary, Cpu, Database, LayoutList, Network } from "lucide-react";
import type { ComponentType } from "react";
import type { Section } from "../types";

type SectionMetadata = {
  name: string;
  collectionLabel: string;
  icon: ComponentType<{ className?: string }>;
};

export const SECTION_META: Record<Section, SectionMetadata> = {
  dsa: {
    name: "DSA",
    collectionLabel: "DSA Interview Questions",
    icon: Binary,
  },
  sql: {
    name: "SQL",
    collectionLabel: "SQL Interview Questions",
    icon: Database,
  },
  "core-cs": {
    name: "Core CS",
    collectionLabel: "Core CS Interview Questions",
    icon: Cpu,
  },
  "system-design": {
    name: "System Design",
    collectionLabel: "System Design Mock Questions",
    icon: Network,
  },
  all: {
    name: "All",
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

export function getQuestionDisplayTitle(section: string, title: string) {
  if (section === "system-design") {
    return "Mock Question";
  }

  return title;
}
