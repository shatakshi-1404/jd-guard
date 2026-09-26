import { useState } from "react";
import { EXAMPLES } from "../examples";

interface Props {
  onAnalyze: (text: string, title: string) => void;
  loading: boolean;
}

export default function JDInput({ onAnalyze, loading }: Props) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  const loadExample = (key: string) => {
    setText(EXAMPLES[key].text);
    setTitle(EXAMPLES[key].title);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="border border-neutral-200 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="px-5 pt-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job title (optional, e.g. Entry Level Software Engineer)"
            className="w-full text-sm font-medium text-neutral-700 outline-none placeholder:text-neutral-400 mb-2"
          />
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full h-56 px-5 py-2 outline-none resize-none text-sm leading-relaxed placeholder:text-neutral-400"
        />
        <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 bg-neutral-50">
          <span className="text-xs text-neutral-400">{text.length} characters</span>
          <div className="flex gap-2">
            <button
              onClick={() => { setText(""); setTitle(""); }}
              className="text-sm px-3 py-1.5 text-neutral-500 hover:text-neutral-700"
            >
              Clear
            </button>
            <button
              onClick={() => onAnalyze(text, title)}
              disabled={!text.trim() || loading}
              className="text-sm px-4 py-1.5 rounded-lg bg-neutral-900 text-white font-medium disabled:opacity-40 hover:bg-neutral-800 transition"
            >
              {loading ? "Analyzing..." : "Analyze JD →"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 justify-center">
        <span className="text-xs text-neutral-400">Try an example:</span>
        {Object.entries(EXAMPLES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => loadExample(key)}
            className="text-xs px-3 py-1 rounded-full border border-neutral-200 hover:border-neutral-400 text-neutral-600"
          >
            {val.title}
          </button>
        ))}
      </div>
    </div>
  );
}
