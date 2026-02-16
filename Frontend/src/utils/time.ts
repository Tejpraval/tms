export const getMinutesAgo = (dateString: string): number => {
  const created = new Date(dateString).getTime();
  const now = Date.now();

  return Math.floor((now - created) / 60000);
};

export const getAgingSeverity = (
  minutes: number
): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" => {
  if (minutes >= 60) return "CRITICAL";
  if (minutes >= 30) return "HIGH";
  if (minutes >= 10) return "MEDIUM";
  return "LOW";
};
