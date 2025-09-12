from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import google.generativeai as genai
#commit
class DebateRequest(BaseModel):
    topic: str

@app.post("/debate")
def generate_debate(request: DebateRequest):
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GEMINI_API_KEY}"
    }

    # Structured prompt asking for JSON
    payload = {
        "contents": [{
            "parts": [{
                "text": (
                    f"Debate the topic: {request.topic}. "
                    f"Return the result strictly in JSON format with this structure:\n\n"
                    f"{{\n"
                    f'  "topic": "{request.topic}",\n'
                    f'  "pro": "Arguments in favor",\n'
                    f'  "con": "Arguments against"\n'
                    f"}}"
                )
            }]
        }]
    }

    response = requests.post(url, headers=headers, json=payload)
    data = response.json()

    # Extract Gemini output
    debate_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")

    try:
        debate_json = eval(debate_text)  # quick parse (safer: use json.loads if valid JSON)
    except Exception:
        debate_json = {"topic": request.topic, "pro": "N/A", "con": "N/A", "raw": debate_text}

    return debate_json
