export type ScoreMeta = {
  color: string
  label: "Strong Buy" | "Opportunity" | "Neutral" | "High Risk"
}

export function getScoreMeta(score: number): ScoreMeta {
  if (score >= 80) {
    return { color: "#1d4ed8", label: "Strong Buy" }
  }

  if (score >= 70) {
    return { color: "#3b82f6", label: "Opportunity" }
  }

  if (score >= 60) {
    return { color: "#64748b", label: "Neutral" }
  }

  return { color: "#94a3b8", label: "High Risk" }
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}
