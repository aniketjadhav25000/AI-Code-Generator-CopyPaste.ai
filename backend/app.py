from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.utils import generate_code_from_prompt

app = FastAPI()

# ✅ Enable CORS for React (running at localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Or ["*"] for all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    prompt: str
    language: str

@app.post("/generate_code")
def generate_code(request: CodeRequest):
    return {"code": generate_code_from_prompt(request.prompt, request.language)}
