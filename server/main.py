from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel 
from data import get_all_courses
from scoring import score_tfidf, score_semantic, score_combined


class ScoreRequest(BaseModel):
    user_blurb: str
    pref_departments: List[str] = []
    num_courses: int = 10
    alpha: float = 0.5


class ScoreResponseItem(BaseModel):
    course: str
    id: str
    score: float
    description: str


class ScoreResponse(BaseModel):
    results: List[ScoreResponseItem]


app = FastAPI()

origins = ["http://localhost:8000", "https://brown-courses.vercel.app/"]
# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/score", response_model=ScoreResponse)
def score_endpoint(request: ScoreRequest):
    # Validate that num_courses is non-negative
    if request.num_courses < 0:
        raise HTTPException(
            status_code=400,
            detail="num_courses must be a non-negative integer"
        )

    # Validate that alpha is between 0 and 1
    if not (0.0 <= request.alpha <= 1.0):
        raise HTTPException(
            status_code=400,
            detail="alpha must be between 0 and 1"
        )

    all_courses = get_all_courses()

    # Compute combined scores
    scores = score_combined(
        user_blurb=request.user_blurb,
        all_courses=all_courses,
        pref_departments=request.pref_departments,
        alpha=request.alpha
    )

    # Pair up courses with their scores
    course_score_pairs = [
        {
            "course": course["title"],
            "id": course["id"],
            "score": score,
            "description": course["description"]
        }
        for course, score in zip(all_courses, scores)
    ]

    # Sort descending by score
    course_score_pairs.sort(key=lambda x: x["score"], reverse=True)

    # Return only the top num_courses (slice will clamp or yield empty list)
    return ScoreResponse(results=course_score_pairs[:request.num_courses])
