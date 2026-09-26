from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import AnalyzeRequest, AnalyzeResponse
from engine import analyze_jd

app = FastAPI(title="JDGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your frontend URL before deploying
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "JDGuard API running"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    return analyze_jd(request.jd_text, request.job_title)
