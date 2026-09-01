import type { Cafe } from "@/lib/cafes";

export function tier(score: number | null): { color: string; label: string } {
  if (score === null) return { color: "#6b6259", label: "not enough evidence" };
  if (score >= 4) return { color: "#7fb069", label: "excellent" };
  if (score >= 3) return { color: "#d97b3f", label: "good" };
  if (score >= 2) return { color: "#c85c3c", label: "middling" };
  return { color: "#8a6a5a", label: "poor" };
}

export const SCORE_ROWS: { key: keyof Cafe["scores"]; label: string }[] = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "charging", label: "Power" },
  { key: "quiet", label: "Quiet" },
  { key: "seating", label: "Seating" },
  { key: "work", label: "Work" },
];

export const EVIDENCE_ORDER: { key: keyof Cafe["evidence"]; label: string }[] = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "charging", label: "Power" },
  { key: "quiet", label: "Quiet" },
  { key: "seating", label: "Seating" },
  { key: "work", label: "Work friendliness" },
];
