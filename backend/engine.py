import json
import re
import spacy
from pathlib import Path
from models import DetectedSignal, AnalyzeResponse

nlp = spacy.load("en_core_web_sm")

RULES_PATH = Path(__file__).parent / "rules.json"
with open(RULES_PATH, "r") as f:
    RULES = json.load(f)["rules"]

SEVERITY_WEIGHTS = {"low": 1, "medium": 2, "high": 3, "positive": -1}


def find_phrase_matches(text: str, rule: dict) -> list[DetectedSignal]:
    """Case-insensitive phrase matching with character offsets."""
    matches = []
    lower_text = text.lower()
    for phrase in rule.get("phrases", []):
        start = 0
        while True:
            idx = lower_text.find(phrase.lower(), start)
            if idx == -1:
                break
            matches.append(DetectedSignal(
                rule_id=rule["id"],
                category=rule["category"],
                severity=rule["severity"],
                matched_phrase=text[idx: idx + len(phrase)],
                explanation=rule["explanation"],
                start_index=idx,
                end_index=idx + len(phrase),
            ))
            start = idx + len(phrase)
    return matches


def detect_salary_signal(text: str, rule: dict) -> list[DetectedSignal]:
    """Detects if a concrete salary figure/range is present -> positive signal."""
    pattern = r"(₹|\$|Rs\.?)\s?\d[\d,]*\s?(-|to|–)\s?(₹|\$|Rs\.?)?\s?\d[\d,]*|\d+\s?(LPA|lpa)"
    match = re.search(pattern, text)
    if match:
        return [DetectedSignal(
            rule_id=rule["id"],
            category=rule["category"],
            severity="positive",
            matched_phrase=match.group(0),
            explanation=rule["explanation"],
            start_index=match.start(),
            end_index=match.end(),
        )]
    return []


def detect_seniority_mismatch(text: str, rule: dict, job_title: str | None) -> list[DetectedSignal]:
    """Flags high years-required against an entry-level-sounding title."""
    doc = nlp(text)
    years_required = None
    span_start, span_end = None, None
    for match in re.finditer(r"(\d+)\+?\s?(?:-\s?\d+\s?)?years?", text.lower()):
        years_required = int(match.group(1))
        span_start, span_end = match.start(), match.end()

    title = (job_title or "").lower()
    entry_signals = ["entry level", "entry-level", "junior", "fresher", "graduate"]
    is_entry_role = any(sig in title for sig in entry_signals) or any(sig in text.lower()[:300] for sig in entry_signals)

    if years_required and years_required >= 4 and is_entry_role and span_start is not None:
        return [DetectedSignal(
            rule_id=rule["id"],
            category=rule["category"],
            severity="medium",
            matched_phrase=f"{years_required}+ years required",
            explanation=rule["explanation"],
            start_index=span_start,
            end_index=span_end,
        )]
    return []


def run_rule_engine(text: str, job_title: str | None = None) -> list[DetectedSignal]:
    all_signals = []
    for rule in RULES:
        detector = rule.get("detector")
        if detector == "salary_regex":
            all_signals.extend(detect_salary_signal(text, rule))
        elif detector == "seniority_mismatch":
            all_signals.extend(detect_seniority_mismatch(text, rule, job_title))
        else:
            all_signals.extend(find_phrase_matches(text, rule))
    return all_signals


def compute_score(signals: list[DetectedSignal]) -> tuple[int, str]:
    raw = sum(SEVERITY_WEIGHTS.get(s.severity, 0) * 8 for s in signals)
    score = max(0, min(100, raw))
    if score < 25:
        label = "Low"
    elif score < 55:
        label = "Moderate"
    else:
        label = "High"
    return score, label


def build_summary(signals: list[DetectedSignal], score: int, label: str) -> str:
    risky = [s for s in signals if s.severity in ("medium", "high")]
    if not risky:
        return "This job description is relatively clear and specific, with few ambiguity signals detected."
    top_categories = list({s.category for s in risky})[:3]
    return (
        f"This JD scored {score}/100 ({label} risk). "
        f"Main areas of concern: {', '.join(top_categories)}. "
        f"Review the highlighted phrases below for details."
    )


def analyze_jd(text: str, job_title: str | None = None) -> AnalyzeResponse:
    signals = run_rule_engine(text, job_title)
    score, label = compute_score(signals)
    high = sum(1 for s in signals if s.severity == "high")
    medium = sum(1 for s in signals if s.severity == "medium")
    low = sum(1 for s in signals if s.severity == "low")
    positive = sum(1 for s in signals if s.severity == "positive")

    return AnalyzeResponse(
        risk_score=score,
        risk_label=label,
        total_signals=len(signals),
        high_count=high,
        medium_count=medium,
        low_count=low,
        positive_count=positive,
        signals=signals,
        summary=build_summary(signals, score, label),
    )
