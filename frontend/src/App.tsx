import { useState } from "react";
import JDInput from "./components/JDInput";
import ScoreCard from "./components/ScoreCard";
import HighlightedJD from "./components/HighlightedJD";
import SignalsList from "./components/SignalsList";
import { analyzeJD } from "./api";
import type { AnalyzeResponse } from "./types";

export default function App() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (text: string, title: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await analyzeJD(text, title);
      setResult(res);
      setJdText(text);
    } catch (e) {
      setError("Something went wrong analyzing this JD. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-semibold text-lg">JDGuard</span>
          <span className="text-xs text-neutral-400">Job Description Risk Analyzer</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold mb-2">
            Read the job description<br />before it reads your time.
          </h1>
          <p className="text-neutral-500 text-sm">
            Paste a JD to check for vague compensation, scope ambiguity, and common red-flag phrasing.
          </p>
        </div>

        <JDInput onAnalyze={handleAnalyze} loading={loading} />

        {error && <p className="text-center text-sm text-red-500 mt-6">{error}</p>}

        {result && (
          <div className="mt-12 space-y-10">
            <ScoreCard result={result} />
            <p className="text-center text-sm text-neutral-600 max-w-xl mx-auto">{result.summary}</p>
            <HighlightedJD text={jdText} signals={result.signals} />
            <SignalsList signals={result.signals} />
          </div>
        )}
      </main>
    </div>
  );
}
