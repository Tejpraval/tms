import { ExplanationItem } from "./explain.types";

export function explainRbacDiffs(
  diffs: Record<string, { gained: string[]; lost: string[] }>
): ExplanationItem[] {
  const items: ExplanationItem[] = [];

  for (const [userId, diff] of Object.entries(diffs)) {
    diff.gained.forEach(p =>
      items.push({
        type: "RBAC",
        message: `User ${userId} gained ${p} due to role permission update`,
      })
    );
    diff.lost.forEach(p =>
      items.push({
        type: "RBAC",
        message: `User ${userId} lost ${p} due to role permission update`,
      })
    );
  }

  return items;
}
