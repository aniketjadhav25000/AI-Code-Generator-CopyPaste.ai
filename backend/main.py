from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from utils import generate_code_from_prompt

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define message schema
class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

# Request with full message history
class CodeRequest(BaseModel):
    messages: List[ChatMessage]

@app.post("/generate_code")
def generate_code(request: CodeRequest):
    try:
        code = generate_code_from_prompt(request.messages)
        return {"code": code}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
