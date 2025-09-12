from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
class DebateRequest(BaseModel):
    topic: str

class DebateResponse(BaseModel):
    topic: str
    pro_argument: str
    con_argument: str
    mediator_analysis: str
    summary: str

@app.get("/")
def read_root():
    return {"message": "Welcome to Vox Dualis - The Ethical Debate Arena"}

@app.post("/debate", response_model=DebateResponse)
async def generate_debate(request: DebateRequest):
    try:
        topic = request.topic.strip()
        if not topic:
            raise HTTPException(status_code=400, detail="Topic cannot be empty")
        
        # Generate arguments concurrently for efficiency
        pro_task = pro_agent.generate_argument(topic)
        con_task = con_agent.generate_argument(topic)
        
        pro_argument, con_argument = await asyncio.gather(pro_task, con_task)
        
        # Generate mediator analysis based on both arguments
        mediator_context = f"Pro argument: {pro_argument}\n\nCon argument: {con_argument}"
        mediator_analysis = await mediator_agent.generate_argument(topic, mediator_context)
        
        # Create a summary
        summary = f"The Senate has heard compelling arguments on '{topic}'. The Champion advocates for the position while the Challenger raises important concerns. The Wise Judge provides balanced analysis for your consideration."
        
        return DebateResponse(
            topic=topic,
            pro_argument=pro_argument,
            con_argument=con_argument,
            mediator_analysis=mediator_analysis,
            summary=summary
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Vox Dualis backend is running"}

# To run the app, use the command:
# uvicorn app.main:app --host   