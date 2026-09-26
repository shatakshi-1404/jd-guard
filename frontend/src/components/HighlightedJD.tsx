import { useState } from "react";
import type { DetectedSignal } from "../types";
import { severityColor, severityLabel } from "./severityStyles";

interface Props {
  text: string;
  signals: DetectedSignal[];
}

export default function HighlightedJD({ text, signals }: Props) {
  const [active, setActive] = useState<DetectedSignal | null>(null);

  // Sort by start index, skip overlaps for simplicity
  const sorted = [...signals].sort((a, b) => a.start_index - b.start_index);
  const segments: { text: string; signal?: DetectedSignal }[] = [];
  let cursor = 0;

  for (const s of sorted) {
    if (s.start_index < cursor) continue; // skip overlapping match
    if (s.start_index > cursor) {
      segments.push({ text: text.slice(cursor, s.start_index) });
    }
    segments.push({ text: text.slice(s.start_index, s.end_index), signal: s });
    cursor = s.end_index;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="border border-neutral-200 rounded-xl bg-white p-5">
        <div className="text-xs font-semibold text-neutral-400 uppercase mb-3">Original JD</div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {segments.map((seg, i) =>
            seg.signal ? (
              <span
                key={i}
                onClick={() => setActive(seg.signal!)}
                className={`cursor-pointer border-b-2 px-0.5 rounded-sm ${
                  seg.signal.severity === "high" ? "border-risk-high bg-red-50" :
                  seg.signal.severity === "medium" ? "border-risk-medium bg-orange-50" :
                  seg.signal.severity === "low" ? "border-risk-low bg-yellow-50" :
                  "border-risk-positive bg-green-50"
                }`}
              >
                {seg.text}
              </span>
            ) : (
              <span key={i}>{seg.text}</span>
            )
          )}
        </p>
      </div>

      <div className="border border-neutral-200 rounded-xl bg-white p-5">
        <div className="text-xs font-semibold text-neutral-400 uppercase mb-3">
          {active ? "Signal Detail" : "Click a highlighted phrase"}
        </div>
        {active ? (
          <div className="space-y-2">
            <span className={`inline-block text-xs px-2 py-1 rounded-full border ${severityColor[active.severity]}`}>
              {severityLabel[active.severity]}
            </span>
            <div className="text-sm font-medium">"{active.matched_phrase}"</div>
            <div className="text-xs text-neutral-400">{active.category} · {active.rule_id}</div>
            <p className="text-sm text-neutral-600 leading-relaxed">{active.explanation}</p>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">Select any underlined phrase on the left to see why it was flagged.</p>
        )}
      </div>
    </div>
  );
}
