from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import google.generativeai as genai
import asyncio
import json
from typing import Dict, List

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Vox Dualis - Ethical Debate Arena", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get API keys from environment
GEMINI_API_KEY_1 = os.getenv("GEMINI_API_KEY_1")  # Pro debater
GEMINI_API_KEY_2 = os.getenv("GEMINI_API_KEY_2")  # Con debater  
GEMINI_API_KEY_3 = os.getenv("GEMINI_API_KEY_3")  # Mediator/Fact-checker

# Validate API keys
if not all([GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_API_KEY_3]):
    raise ValueError("Missing required API keys. Please check your .env file.")

# Configure models for each agent
genai.configure(api_key=GEMINI_API_KEY_1)
pro_model = genai.GenerativeModel("gemini-1.5-flash")

class DebateAgent:
    def __init__(self, api_key: str, role: str, personality: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.role = role
        self.personality = personality
    
    async def generate_argument(self, topic: str, context: str = "") -> str:
        try:
            prompt = f"""
            You are {self.role} in the ancient Roman Senate debate arena of Vox Dualis.
            {self.personality}
            
            Topic for debate: {topic}
            {f"Previous context: {context}" if context else ""}
            
            Provide a compelling, well-reasoned argument. Keep it concise but powerful.
            Use classical rhetoric techniques. Maximum 200 words.
            """
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating argument: {str(e)}"

# Initialize the three debate agents
pro_agent = DebateAgent(
    GEMINI_API_KEY_1, 
    "Marcus Advocatus - The Champion",
    "You argue FOR the given topic with passion and conviction. You are a skilled orator who finds the strongest points in favor of any position. You use persuasive language and compelling examples."
)

con_agent = DebateAgent(
    GEMINI_API_KEY_2,
    "Gaius Contradictor - The Challenger", 
    "You argue AGAINST the given topic with sharp logic and critical thinking. You identify weaknesses, potential harms, and counterarguments. You are the voice of skepticism and caution."
)

mediator_agent = DebateAgent(
    GEMINI_API_KEY_3,
    "Lucius Moderator - The Wise Judge",
    "You are the impartial mediator and fact-checker. You identify logical fallacies, check claims for accuracy, and ensure the debate remains civil and productive. You summarize key points fairly."
)

# Pydantic models
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
