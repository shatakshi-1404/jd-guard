import type { AnalyzeResponse } from "../types";

export default function ScoreCard({ result }: { result: AnalyzeResponse }) {
  const ringColor =
    result.risk_label === "High" ? "stroke-risk-high" :
    result.risk_label === "Moderate" ? "stroke-risk-medium" : "stroke-risk-positive";

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e5e5" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="52" fill="none"
            className={ringColor}
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 52}
            strokeDashoffset={2 * Math.PI * 52 * (1 - result.risk_score / 100)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold">{result.risk_score}</span>
          <span className="text-xs text-neutral-400">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium uppercase tracking-wide text-neutral-500">
          {result.risk_label} Risk
        </div>
        <div className="text-xs text-neutral-400 mt-1">
          {result.total_signals} signals detected
        </div>
      </div>
      <div className="flex gap-4 text-xs">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-high inline-block" /> {result.high_count} High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-medium inline-block" /> {result.medium_count} Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-low inline-block" /> {result.low_count} Low</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-positive inline-block" /> {result.positive_count} Positive</span>
      </div>
    </div>
  );
}
