from pydantic import BaseModel
from typing import List, Optional


class AnalyzeRequest(BaseModel):
    jd_text: str
    job_title: Optional[str] = None


class DetectedSignal(BaseModel):
    rule_id: str
    category: str
    severity: str          # "low" | "medium" | "high" | "positive"
    matched_phrase: str
    explanation: str
    start_index: int       # character offset in original text, for frontend highlighting
    end_index: int


class AnalyzeResponse(BaseModel):
    risk_score: int                # 0-100
    risk_label: str                 # "Low" | "Moderate" | "High"
    total_signals: int
    high_count: int
    medium_count: int
    low_count: int
    positive_count: int
    signals: List[DetectedSignal]
    summary: str
