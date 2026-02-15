import { ExplanationItem } from "./explain.types";

export function explainAbacChanges(
  changes: {
    userId: string;
    action: string;
    from: "ALLOW" | "DENY";
    to: "ALLOW" | "DENY";
  }[]
): ExplanationItem[] {
  return changes.map(c => ({
    type: "ABAC",
    message: `User ${c.userId} changed ${c.action} from ${c.from} to ${c.to} due to attribute update`,
  }));
}
