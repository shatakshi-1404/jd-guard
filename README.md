# JDGuard — Job Description Risk Analyzer

Paste a job description, get an explainable risk breakdown: vague compensation
language, scope-ambiguity phrases, unpaid-overtime euphemisms, and
seniority-vs-experience mismatches — each one tied to the exact phrase that
triggered it.

Built as a rule-engine + NLP pipeline, not a black-box classifier — every
flag traces back to a specific rule ID, category, and explanation, so results
are auditable rather than a mystery score.

## Why rule-based, not ML

A trained classifier needs a labeled dataset of "risky" vs "safe" JDs, which
doesn't exist in any reliable public form. A rule engine avoids
fabricated confidence scores and lets every detection be explained in one
sentence — which is also just a more honest thing to ship as a v1.

## Architecture

```
React + TypeScript (Vite, Tailwind)
        |
        v
FastAPI  /analyze
        |
        v
Rule Engine (JSON ruleset, ~16 rules)
   |            |
   v            v
Phrase match   spaCy NER
(regex/keyword) (years-of-exp, salary figures)
        |
        v
Risk Aggregator (weighted severity score, 0-100)
        |
        v
Structured JSON (signals + offsets + explanations)
        |
        v
Dashboard (score ring, highlighted split-view, signal list)
```

## Tech stack

- **Backend:** FastAPI, Python, spaCy (`en_core_web_sm`)
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **No database** in v1 — stateless request/response

## Run locally

Backend:
```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload
```

Frontend:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Test the API directly:
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"jd_text": "We need a rockstar developer who can wear many hats in a fast-paced environment. Competitive salary. 5+ years experience required for this entry-level role.", "job_title": "Entry Level Software Engineer"}'
```

## Example

Input: *"We need a rockstar developer who can wear many hats... Competitive
salary. 5+ years experience required for this entry-level role."*

Output: 4 signals detected — vague culture language (`rockstar`), scope
ambiguity (`wear many hats`), compensation ambiguity (`competitive salary`),
and a seniority mismatch (5+ years vs. entry-level title) — risk score
62/100 (Moderate).

## Deployment

**Backend → Render**
1. New Web Service, root directory `backend`.
2. Build command: `pip install -r requirements.txt && python -m spacy download en_core_web_sm`
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Before going live, tighten CORS in `main.py` to your actual frontend domain.

**Frontend → Vercel**
1. Import repo, root directory `frontend`.
2. Set env var `VITE_API_URL` to your Render backend URL.
3. Deploy (Vercel auto-detects Vite).

Note: Render's free tier spins down on inactivity — first request after idle
can take 30–50s.

## Roadmap

- Chrome extension: analyze a JD directly on a LinkedIn/Naukri posting
- PDF upload support
- Recruiter-facing mode: "how might candidates read this JD"
- Expand ruleset with user-submitted phrase suggestions
