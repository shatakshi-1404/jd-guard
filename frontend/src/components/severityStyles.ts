export const severityColor: Record<string, string> = {
  high: "text-risk-high bg-red-50 border-red-200",
  medium: "text-risk-medium bg-orange-50 border-orange-200",
  low: "text-risk-low bg-yellow-50 border-yellow-200",
  positive: "text-risk-positive bg-green-50 border-green-200",
};

export const severityDot: Record<string, string> = {
  high: "bg-risk-high",
  medium: "bg-risk-medium",
  low: "bg-risk-low",
  positive: "bg-risk-positive",
};

export const severityLabel: Record<string, string> = {
  high: "High Risk",
  medium: "Medium Risk",
  low: "Low Risk",
  positive: "Positive Signal",
};
