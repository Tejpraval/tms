import crypto from "crypto";

export function computeBucket(
  userId: string,
  policyId: string
): number {
  const hash = crypto
    .createHash("sha256")
    .update(userId + policyId)
    .digest("hex");

  const intVal = parseInt(hash.substring(0, 8), 16);
  return intVal % 100;
}
