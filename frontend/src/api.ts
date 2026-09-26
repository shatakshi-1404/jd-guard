import axios from "axios";
import type { AnalyzeResponse } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function analyzeJD(jdText: string, jobTitle?: string): Promise<AnalyzeResponse> {
  const res = await axios.post<AnalyzeResponse>(`${API_BASE}/analyze`, {
    jd_text: jdText,
    job_title: jobTitle || null,
  });
  return res.data;
}
