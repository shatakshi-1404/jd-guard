import type { DetectedSignal } from "../types";
import { severityColor, severityLabel } from "./severityStyles";

export default function SignalsList({ signals }: { signals: DetectedSignal[] }) {
  const risky = signals.filter((s) => s.severity !== "positive");
  const positive = signals.filter((s) => s.severity === "positive");

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold text-neutral-400 uppercase mb-3">🚩 Detected Signals</div>
        <div className="space-y-2">
          {risky.map((s, i) => (
            <div key={i} className={`border rounded-xl p-4 ${severityColor[s.severity]}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">"{s.matched_phrase}"</span>
                <span className="text-xs font-medium">{severityLabel[s.severity]}</span>
              </div>
              <div className="text-xs text-neutral-500 mb-1">{s.category}</div>
              <p className="text-sm text-neutral-600">{s.explanation}</p>
            </div>
          ))}
          {risky.length === 0 && (
            <p className="text-sm text-neutral-400">No major red flags detected.</p>
          )}
        </div>
      </div>

      {positive.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-neutral-400 uppercase mb-3">✓ Positive Signals</div>
          <div className="space-y-2">
            {positive.map((s, i) => (
              <div key={i} className="border rounded-xl p-4 text-risk-positive bg-green-50 border-green-200">
                <div className="text-sm font-medium mb-1">{s.category}</div>
                <p className="text-sm text-neutral-600">{s.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
