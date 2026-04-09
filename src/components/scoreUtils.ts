export type ScoreMeta = {
  color: string
  label: "Strong Buy" | "Opportunity" | "Neutral" | "High Risk"
}

export function getScoreMeta(score: number): ScoreMeta {
  if (score >= 80) {
    return { color: "#16a34a", label: "Strong Buy" }
  }

  if (score >= 70) {
    return { color: "#2563eb", label: "Opportunity" }
  }

  if (score >= 60) {
    return { color: "#d97706", label: "Neutral" }
  }

  return { color: "#dc2626", label: "High Risk" }
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}
