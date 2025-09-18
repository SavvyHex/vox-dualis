from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
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
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://*.vercel.app",   # Vercel deployments
        "https://*.railway.app",  # Railway deployments
        "https://*.netlify.app",  # Netlify deployments
    ],
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
    def __init__(self, api_key: str, role: str, personality: str, argument_style: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.role = role
        self.personality = personality
        self.argument_style = argument_style
    
    async def generate_argument(self, topic: str, context: str = "") -> str:
        try:
            prompt = f"""
            You are {self.role} - a master rhetorician in the ancient Roman Senate of Vox Dualis.
            
            {self.personality}
            
            DEBATE TOPIC: {topic}
            
            {self.argument_style}
            
            CRITICAL REQUIREMENTS:
            1. Use SPECIFIC, VERIFIABLE facts, statistics, or historical examples
            2. Include at least 2-3 concrete pieces of evidence
            3. Address real-world implications and consequences
            4. Use powerful, persuasive language that moves the audience
            5. Anticipate and preemptively counter obvious objections
            6. Make your argument so compelling that fence-sitters will be swayed
            7. Structure: Hook → Evidence → Logic → Emotional Appeal → Call to Action
            
            {f"PREVIOUS DEBATE CONTEXT TO BUILD UPON: {context}" if context else ""}
            
            Your argument must be 250-300 words of pure persuasive power. Make every sentence count.
            Begin with a powerful opening statement that immediately grabs attention.
            """
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating argument: {str(e)}"

# Initialize the three debate agents with enhanced personalities and argument styles
pro_agent = DebateAgent(
    GEMINI_API_KEY_1,
    "Pro Debater",
    """Present the strongest, most remarkable evidence and reasoning supporting the topic. Focus on:
    - Key facts, statistics, and research findings
    - Real-world examples and case studies
    - Logical, concise arguments
    - Directly address the main points only
    - Avoid introductions, names, or emotional appeals
    - Do not address the audience; just state the case
    """,
    """
    PRO DEBATE STRATEGY:
    - Start with the most compelling fact or statistic
    - Use 2-3 pieces of hard evidence
    - Highlight the most important benefits and positive outcomes
    - Address the strongest counterpoint with a direct rebuttal
    - End with a clear, logical conclusion
    """
)

con_agent = DebateAgent(
    GEMINI_API_KEY_2,
    "Con Debater",
    """Present the strongest, most critical evidence and reasoning against the topic. Focus on:
    - Key risks, failures, and negative outcomes
    - Hard data, expert warnings, and case studies
    - Directly address the main points only
    - Avoid introductions, names, or emotional appeals
    - Do not address the audience; just state the case
    """,
    """
    CON DEBATE STRATEGY:
    - Start with the most devastating fact or risk
    - Use 2-3 pieces of hard evidence or expert warnings
    - Highlight the most important dangers and negative outcomes
    - Address the strongest pro point with a direct rebuttal
    - End with a clear, logical conclusion
    """
)

mediator_agent = DebateAgent(
    GEMINI_API_KEY_3,
    "Lucius Moderator - The Truth Seeker",
    """You are the wisest judge in the Senate - incorruptible and brilliant.
    You see through rhetoric to find truth. You have studied both sides extensively.
    You speak with the authority of someone who values evidence over emotion.""",
    """
    MEDIATION STRATEGY:
    - Fact-check specific claims made by both sides
    - Identify logical fallacies and weak reasoning
    - Highlight the strongest point from each argument
    - Reveal what both sides are NOT telling you
    - Provide missing context or nuance
    - Suggest synthesis or middle-ground solutions
    - Point out areas where more evidence is needed
    
    ANALYSIS FRAMEWORK:
    - Verify factual claims and statistics
    - Assess the quality and relevance of evidence
    - Identify emotional manipulation vs. logical reasoning
    - Highlight confirmation bias or cherry-picking
    - Suggest additional perspectives to consider
    - Rate the overall strength of each position
    """
)

# Pydantic models
class DebateRequest(BaseModel):
    topic: str

class IntenseDebateRequest(BaseModel):
    topic: str
    intensity: str = "high"  # low, medium, high, extreme

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
        
        # Enhanced prompts for more compelling arguments
        enhanced_topic_context = f"""
        DEBATE MODERATOR BRIEFING: The citizens of Rome gather to hear arguments on: "{topic}"
        
        This is not academic exercise - real decisions hang in the balance.
        The audience includes skeptics, believers, and undecided citizens who need CONVINCING EVIDENCE.
        
        Each speaker has 300 words to change minds and shape the future.
        Arguments must be backed by facts, examples, and compelling logic.
        Weak reasoning will be immediately exposed and ridiculed.
        
        THE STAKES ARE HIGH. MAKE YOUR CASE COUNT.
        """
        
        # Generate arguments concurrently for efficiency
        pro_task = pro_agent.generate_argument(f"{enhanced_topic_context}\n\nARGUE POWERFULLY FOR: {topic}")
        con_task = con_agent.generate_argument(f"{enhanced_topic_context}\n\nARGUE RUTHLESSLY AGAINST: {topic}")
        
        pro_argument, con_argument = await asyncio.gather(pro_task, con_task)
        
        # Enhanced mediator analysis with fact-checking focus
        mediator_context = f"""
        JUDGE'S CHAMBERS - CRITICAL ANALYSIS REQUIRED
        
        Topic: {topic}
        
        MARCUS ADVOCATUS argued:
        {pro_argument}
        
        GAIUS CONTRADICTOR countered:
        {con_argument}
        
        Your task: Dissect these arguments with surgical precision.
        Which claims can be verified? Which are opinion masquerading as fact?
        What evidence is missing? What logical fallacies were used?
        Who made the stronger case based on EVIDENCE, not rhetoric?
        """
        
        mediator_analysis = await mediator_agent.generate_argument(
            "FACT-CHECK AND ANALYZE THE DEBATE", 
            mediator_context
        )
        
        # Create a compelling summary that emphasizes the gravity
        summary = f"""🏛️ The Roman Senate has heard passionate testimony on '{topic}'. 
        
        Marcus Advocatus painted a vision of progress and opportunity, while Gaius Contradictor exposed hidden dangers and costs. Lucius Moderator has weighed the evidence with impartial wisdom.
        
        The decision now rests with you, citizen. Choose wisely - the future may depend on it."""
        
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

@app.post("/debate/intense", response_model=DebateResponse)
async def generate_intense_debate(request: IntenseDebateRequest):
    """Generate an extremely intense, fact-heavy debate with maximum persuasive power"""
    try:
        topic = request.topic.strip()
        intensity = request.intensity
        
        if not topic:
            raise HTTPException(status_code=400, detail="Topic cannot be empty")
        
        # Ultra-enhanced prompts based on intensity
        intensity_modifiers = {
            "extreme": {
                "urgency": "CIVILIZATION-DEFINING CRISIS",
                "stakes": "The fate of humanity hangs in the balance",
                "evidence_requirement": "Use SHOCKING statistics, Nobel Prize research, and world-changing examples",
                "word_count": "400-500 words of devastating persuasion"
            },
            "high": {
                "urgency": "CRITICAL DECISION POINT", 
                "stakes": "Millions of lives and billions of dollars at stake",
                "evidence_requirement": "Use concrete data, peer-reviewed studies, and real case studies",
                "word_count": "300-350 words of compelling evidence"
            },
            "medium": {
                "urgency": "IMPORTANT CHOICE",
                "stakes": "Significant consequences for society",
                "evidence_requirement": "Use verified facts, expert opinions, and documented examples", 
                "word_count": "250-300 words of solid reasoning"
            }
        }
        
        modifier = intensity_modifiers.get(intensity, intensity_modifiers["high"])
        
        ultra_enhanced_context = f"""
        🚨 {modifier['urgency']} ALERT 🚨
        
        SENATE EMERGENCY SESSION ON: "{topic}"
        
        {modifier['stakes']}. This is NOT theoretical - real consequences await.
        
        SPEAKER REQUIREMENTS:
        - {modifier['evidence_requirement']}
        - Deliver {modifier['word_count']}
        - Every claim must be VERIFIABLE and DEVASTATING to opponents
        - Use emotional appeals backed by HARD DATA
        - Make fence-sitters feel STUPID for not choosing your side
        - This argument could be quoted in history books
        
        The audience includes world leaders, scientists, economists, and skeptics.
        WEAK ARGUMENTS WILL BE DESTROYED. BRING YOUR A-GAME.
        """
        
        # Generate ultra-compelling arguments
        pro_task = pro_agent.generate_argument(f"{ultra_enhanced_context}\n\nDEFEND WITH YOUR LIFE: {topic}")
        con_task = con_agent.generate_argument(f"{ultra_enhanced_context}\n\nDESTROY THE CASE FOR: {topic}")
        
        pro_argument, con_argument = await asyncio.gather(pro_task, con_task)
        
        # Ultra-detailed mediator analysis
        ultra_mediator_context = f"""
        🏛️ SUPREME COURT OF LOGIC - FINAL JUDGMENT REQUIRED
        
        Topic: {topic}
        Intensity Level: {intensity.upper()}
        
        PROSECUTION (PRO) PRESENTED:
        {pro_argument}
        
        DEFENSE (CON) PRESENTED:
        {con_argument}
        
        Your Honor, the people demand TRUTH. Dissect every claim with forensic precision:
        
        1. FACT-CHECK: Which specific claims can be independently verified?
        2. LOGIC TEST: What reasoning errors or fallacies were committed?
        3. EVIDENCE QUALITY: How strong is the supporting data?
        4. HIDDEN AGENDA: What are they NOT telling us?
        5. REAL-WORLD IMPACT: What actually happens if we follow each path?
        6. VERDICT: Based purely on evidence and logic, which case is stronger?
        
        Deliver 350-400 words of surgical analysis that reveals the TRUTH.
        """
        
        mediator_analysis = await mediator_agent.generate_argument(
            "RENDER SUPREME JUDGMENT", 
            ultra_mediator_context
        )
        
        # Epic summary
        summary = f"""⚔️ GLADIATORIAL DEBATE COMPLETE ⚔️
        
        The greatest minds in Rome have clashed over '{topic}' with devastating force.
        
        Marcus Advocatus wielded the sword of progress and possibility.
        Gaius Contradictor unleashed the shield of caution and consequence.
        Lucius Moderator has weighed their souls on the scales of truth.
        
        The arena falls silent. The decision is yours, but choose knowing that history will judge your wisdom.
        
        May the gods favor the righteous. 🏛️"""
        
        return DebateResponse(
            topic=topic,
            pro_argument=pro_argument,
            con_argument=con_argument,
            mediator_analysis=mediator_analysis,
            summary=summary
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
