export interface DetectedSignal {
  rule_id: string;
  category: string;
  severity: "low" | "medium" | "high" | "positive";
  matched_phrase: string;
  explanation: string;
  start_index: number;
  end_index: number;
}

export interface AnalyzeResponse {
  risk_score: number;
  risk_label: string;
  total_signals: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  positive_count: number;
  signals: DetectedSignal[];
  summary: string;
}
