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

# Get frontend URLs from environment (for flexible deployment)
FRONTEND_URLS = os.getenv("FRONTEND_URLS").split(",")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_URLS,
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
pro_model = genai.GenerativeModel("gemini-2.5-flash")

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
            You are {self.role} - a world-renowned expert debater and public intellectual.
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
            8. **MANDATORY: Cite specific sources for your claims using this format:**
               - [Source: Organization/Study Name, Year] for statistics
               - [Source: "Quote from Expert Name, Title, Institution"] for expert opinions
               - [Source: Historical Event/Case Study Name] for examples
               - [Source: Research Paper/Report Title] for studies
            
            {f"PREVIOUS DEBATE CONTEXT TO BUILD UPON: {context}" if context else ""}
            
            Your argument must be 250-300 words of pure persuasive power with CREDIBLE SOURCES.
            Every major claim must have a source citation. Make every sentence count.
            Begin with a powerful opening statement that immediately grabs attention.
            End with a "Sources Referenced:" section listing your citations.
            
            FORMATTING: Use markdown formatting only. For line breaks, use double spaces followed by a newline.
            DO NOT use HTML tags like <br>, <b>, or <i>. Use markdown syntax instead.
            """
            
            response = self.model.generate_content(prompt)
            # Clean up any HTML tags that might be generated
            clean_text = response.text
            clean_text = clean_text.replace('<br>', '\n')
            clean_text = clean_text.replace('<br/>', '\n')
            clean_text = clean_text.replace('<br />', '\n')
            clean_text = clean_text.replace('<b>', '**')
            clean_text = clean_text.replace('</b>', '**')
            clean_text = clean_text.replace('<i>', '_')
            clean_text = clean_text.replace('</i>', '_')
            clean_text = clean_text.replace('<strong>', '**')
            clean_text = clean_text.replace('</strong>', '**')
            clean_text = clean_text.replace('<em>', '_')
            clean_text = clean_text.replace('</em>', '_')
            return clean_text
        except Exception as e:
            return f"Error generating argument: {str(e)}"

# Initialize the three debate agents with enhanced personalities and argument styles
pro_agent = DebateAgent(
    GEMINI_API_KEY_1, 
    "Marcus Advocatus - The Visionary Champion",
    """You are one of the world's most persuasive advocates and thought leaders. You see the transformative potential in every idea.
    You have access to cutting-edge research, success stories, and visionary insights from global institutions.
    You speak with the passion of someone who has witnessed positive change firsthand and understands how progress happens.""",
    """
    ARGUMENT STRATEGY FOR PRO POSITION:
    - Lead with shocking statistics or breakthrough examples that prove your point
    - Cite specific case studies, research papers, or real-world success stories WITH SOURCES
    - Paint a vivid picture of the positive future this stance creates
    - Use urgency: "We cannot afford to wait" or "History will judge us"
    - Address the cost of inaction with concrete examples and citations
    - End with an inspiring vision that makes opposing seem foolish
    
    EVIDENCE TYPES TO USE (WITH MANDATORY CITATIONS):
    - Economic data and ROI figures [Source: World Bank, IMF, Government Reports]
    - Scientific studies and peer-reviewed research [Source: Nature, Science, specific journals]
    - Historical precedents and success stories [Source: Historical events, case studies]
    - Expert testimonials and quotes [Source: "Expert Name, Title, Institution"]
    - Technological breakthroughs and innovations [Source: Company reports, tech studies]
    - Social impact metrics and case studies [Source: NGO reports, social research]
    
    CITATION REQUIREMENT: Every major statistic, claim, or example MUST include a source.
    FORMATTING: Use ONLY markdown formatting. NO HTML tags whatsoever.
    """
)

con_agent = DebateAgent(
    GEMINI_API_KEY_2,
    "Gaius Contradictor - The Ruthless Realist", 
    """You are one of the world's most feared debaters and critical thinkers - the expert who exposes uncomfortable truths.
    You have investigated every failure, every unintended consequence, every hidden cost across industries and policies.
    You speak with the authority of someone who has seen promising ideas crash and burn, and who values caution over optimism.""",
    """
    ARGUMENT STRATEGY FOR CON POSITION:
    - Open with a devastating example of failure or unintended consequences
    - Expose hidden costs, risks, or negative externalities with hard data AND SOURCES
    - Reveal who really benefits vs. who pays the price
    - Use fear of real, documented dangers with citations
    - Show how similar initiatives have failed catastrophically with specific examples
    - Highlight the safer, proven alternative approach
    
    EVIDENCE TYPES TO USE (WITH MANDATORY CITATIONS):
    - Failure case studies and cautionary tales [Source: Historical records, case studies]
    - Risk assessment data and safety statistics [Source: Safety agencies, regulatory bodies]
    - Economic burden and cost-benefit analyses [Source: Economic research, government data]
    - Regulatory warnings and expert concerns [Source: "Expert Name, Agency, Date"]
    - Historical disasters and lessons learned [Source: Historical events, investigations]
    - Victims' testimonials and impact studies [Source: Victim advocacy groups, research]
    
    CITATION REQUIREMENT: Every warning, statistic, or failure example MUST include a source.
    FORMATTING: Use ONLY markdown formatting. NO HTML tags whatsoever.
    """)

mediator_agent = DebateAgent(
    GEMINI_API_KEY_3,
    "Lucius Moderator - The Truth Seeker",
    """You are one of the world's most respected judges and analytical minds - incorruptible and brilliant.
    You see through rhetoric to find truth. You have studied both sides of countless debates extensively.
    You speak with the authority of someone who values evidence over emotion and seeks objective truth above all.""",
    """
    MEDIATION STRATEGY:
    - Fact-check specific claims made by both sides with source verification
    - Identify logical fallacies and weak reasoning
    - Highlight the strongest point from each argument
    - Reveal what both sides are NOT telling you
    - Provide missing context or nuance with additional sources
    - Suggest synthesis or middle-ground solutions
    - Point out areas where more evidence is needed
    - Verify the credibility and accuracy of cited sources
    - Present analysis in a clear tabular format for easy comparison
    
    ANALYSIS FRAMEWORK:
    - Verify factual claims and statistics against reliable sources
    - Assess the quality and relevance of evidence and citations
    - Identify emotional manipulation vs. logical reasoning
    - Highlight confirmation bias or cherry-picking
    - Check if sources are credible, current, and relevant
    - Suggest additional perspectives to consider with source recommendations
    - Rate the overall strength of each position based on source quality
    
    MANDATORY OUTPUT FORMAT:
    Structure your analysis using markdown tables to compare arguments side-by-side.
    Include sections for: Key Claims, Evidence Quality, Logical Strength, Source Credibility, and Final Assessment.
    
    CITATION VERIFICATION: Check if the sources cited are legitimate and accurately represented.
    """)

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
        DEBATE MODERATOR BRIEFING: A distinguished audience gathers to hear expert arguments on: "{topic}"
        
        This is not an academic exercise - real decisions hang in the balance.
        The audience includes skeptics, believers, and undecided citizens who need CONVINCING EVIDENCE WITH SOURCES.
        
        Each speaker has 300 words to change minds and shape the future.
        Arguments must be backed by facts, examples, compelling logic, AND CREDIBLE SOURCES.
        Weak reasoning or unsourced claims will be immediately exposed and ridiculed.
        
        MANDATORY: Every major claim must include a source citation using this format:
        [Source: Organization/Study, Year] or [Source: "Expert Name, Title"]
        
        THE STAKES ARE HIGH. MAKE YOUR CASE COUNT WITH PROOF.
        """
        
        # Generate arguments concurrently for efficiency
        pro_task = pro_agent.generate_argument(f"{enhanced_topic_context}\n\nARGUE POWERFULLY FOR: {topic}")
        con_task = con_agent.generate_argument(f"{enhanced_topic_context}\n\nARGUE RUTHLESSLY AGAINST: {topic}")
        
        pro_argument, con_argument = await asyncio.gather(pro_task, con_task)
        
        # Generate mediator analysis based on both arguments
        # Enhanced mediator analysis with fact-checking focus
        mediator_context = f"""
        EXPERT ANALYSIS CHAMBERS - CRITICAL REVIEW REQUIRED
        
        Topic: {topic}
        
        MARCUS ADVOCATUS argued:
        {pro_argument}
        
        GAIUS CONTRADICTOR countered:
        {con_argument}
        
        Your task: Dissect these arguments with surgical precision and present your analysis in a clear tabular format.
        
        REQUIRED OUTPUT FORMAT:
        Use markdown tables to organize your analysis. Structure your response as follows:
        
        FORMATTING REQUIREMENTS:
        - Use ONLY markdown syntax - NO HTML tags like <br>, <b>, <i>
        - For line breaks within table cells, use double spaces followed by newline
        - Keep table cell content concise but informative
        
        ## Argument Comparison Summary
        
        | Aspect | Marcus Advocatus (PRO) | Gaius Contradictor (CON) |
        |--------|------------------------|---------------------------|
        | **Main Claim** | [Summarize key argument] | [Summarize key argument] |
        | **Key Evidence** | [List 2-3 strongest pieces] | [List 2-3 strongest pieces] |
        | **Source Quality** | [Rate: High/Medium/Low + reasoning] | [Rate: High/Medium/Low + reasoning] |
        | **Logical Strength** | [Assess reasoning quality] | [Assess reasoning quality] |
        | **Weaknesses** | [Identify gaps/flaws] | [Identify gaps/flaws] |
        
        ## Evidence Verification
        | Claim | Source Cited | Credibility Assessment | Accuracy |
        |-------|--------------|------------------------|-----------|
        | [Specific claim 1] | [Source name] | [High/Medium/Low] | [Verified/Questionable/False] |
        | [Specific claim 2] | [Source name] | [High/Medium/Low] | [Verified/Questionable/False] |
        
        ## Final Assessment
        | Category | Winner | Reasoning |
        |----------|---------|-----------|
        | **Evidence Quality** | [Marcus/Gaius/Tie] | [Brief explanation] |
        | **Logical Reasoning** | [Marcus/Gaius/Tie] | [Brief explanation] |
        | **Source Credibility** | [Marcus/Gaius/Tie] | [Brief explanation] |
        | **Overall Strength** | [Marcus/Gaius/Tie] | [Comprehensive reasoning] |
        
        Provide detailed analysis within each table cell while maintaining clarity and objectivity.
        """
        
        mediator_analysis = await mediator_agent.generate_argument(
            "FACT-CHECK AND ANALYZE THE DEBATE", 
            mediator_context
        )
        
        # Create a compelling summary that emphasizes the gravity
        summary = f"""� The expert panel has heard passionate testimony on '{topic}'. 
        
        Marcus Advocatus painted a vision of progress and opportunity, while Gaius Contradictor exposed hidden dangers and costs. Lucius Moderator has weighed the evidence with impartial wisdom.
        
        The decision now rests with you. Choose wisely - the future may depend on it."""
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
        
        EXPERT PANEL EMERGENCY SESSION ON: "{topic}"
        
        {modifier['stakes']}. This is NOT theoretical - real consequences await.
        
        SPEAKER REQUIREMENTS:
        - {modifier['evidence_requirement']}
        - Deliver {modifier['word_count']}
        - Every claim must be VERIFIABLE with CREDIBLE SOURCES and DEVASTATING to opponents
        - Use emotional appeals backed by HARD DATA and CITATIONS
        - Make fence-sitters feel STUPID for not choosing your side
        - This argument could be quoted in history books
        - MANDATORY: Include source citations for all major claims using [Source: Name, Year] format
        
        The audience includes world leaders, scientists, economists, and skeptics.
        WEAK ARGUMENTS OR MISSING SOURCES WILL BE DESTROYED. BRING YOUR A-GAME WITH PROOF.
        """
        
        # Generate ultra-compelling arguments
        pro_task = pro_agent.generate_argument(f"{ultra_enhanced_context}\n\nDEFEND WITH YOUR LIFE: {topic}")
        con_task = con_agent.generate_argument(f"{ultra_enhanced_context}\n\nDESTROY THE CASE FOR: {topic}")
        
        pro_argument, con_argument = await asyncio.gather(pro_task, con_task)
        
        # Ultra-detailed mediator analysis
        ultra_mediator_context = f"""
        🏛 EXPERT ANALYSIS TRIBUNAL - FINAL JUDGMENT REQUIRED
        
        Topic: {topic}
        Intensity Level: {intensity.upper()}
        
        PROSECUTION (PRO) PRESENTED:
        {pro_argument}
        
        DEFENSE (CON) PRESENTED:
        {con_argument}
        
        Distinguished analyst, the people demand TRUTH. Dissect every claim with forensic precision and present your analysis in comprehensive tabular format.
        
        MANDATORY TABULAR OUTPUT FORMAT:
        
        ## COMPREHENSIVE ARGUMENT ANALYSIS
        
        | Evaluation Criteria | Marcus Advocatus (PRO) | Gaius Contradictor (CON) | Analysis |
        |-------------------|------------------------|---------------------------|-----------|
        | **Primary Argument** | [Core thesis] | [Core thesis] | [Comparative strength] |
        | **Evidence Quantity** | [# of sources/claims] | [# of sources/claims] | [Which has more support] |
        | **Evidence Quality** | [Assessment + rating] | [Assessment + rating] | [Which is more credible] |
        | **Logical Structure** | [Reasoning evaluation] | [Reasoning evaluation] | [Which flows better] |
        | **Factual Accuracy** | [Verification status] | [Verification status] | [Which is more accurate] |
        | **Source Credibility** | [Source assessment] | [Source assessment] | [Which uses better sources] |
        | **Bias Detection** | [Identified biases] | [Identified biases] | [Which is more objective] |
        | **Missing Context** | [What's not addressed] | [What's not addressed] | [Critical gaps] |
        
        ## DETAILED SOURCE VERIFICATION
        | Claim | Side | Source | Credibility | Accuracy | Notes |
        |-------|------|--------|-------------|----------|-------|
        | [Specific claim 1] | PRO/CON | [Source name] | High/Med/Low | ✓/✗/?  | [Comments] |
        | [Specific claim 2] | PRO/CON | [Source name] | High/Med/Low | ✓/✗/?  | [Comments] |
        | [Specific claim 3] | PRO/CON | [Source name] | High/Med/Low | ✓/✗/?  | [Comments] |
        
        ## LOGICAL FALLACY DETECTION
        | Fallacy Type | Marcus Advocatus | Gaius Contradictor | Impact |
        |--------------|------------------|---------------------|---------|
        | Appeal to Emotion | [Yes/No + example] | [Yes/No + example] | [Effect on argument] |
        | Cherry Picking | [Yes/No + example] | [Yes/No + example] | [Effect on argument] |
        | False Dichotomy | [Yes/No + example] | [Yes/No + example] | [Effect on argument] |
        | Ad Hominem | [Yes/No + example] | [Yes/No + example] | [Effect on argument] |
        
        ## FINAL VERDICT
        | Category | Winner | Score (1-10) | Justification |
        |----------|---------|---------------|---------------|
        | **Evidence Quality** | Marcus/Gaius/Tie | [Score] | [Detailed reasoning] |
        | **Logical Rigor** | Marcus/Gaius/Tie | [Score] | [Detailed reasoning] |
        | **Source Credibility** | Marcus/Gaius/Tie | [Score] | [Detailed reasoning] |
        | **Factual Accuracy** | Marcus/Gaius/Tie | [Score] | [Detailed reasoning] |
        | **Overall Winner** | Marcus/Gaius/Tie | [Total] | [Comprehensive analysis] |
        
        Provide thorough analysis within each cell while maintaining objectivity and precision.
        """
        
        mediator_analysis = await mediator_agent.generate_argument(
            "RENDER SUPREME JUDGMENT", 
            ultra_mediator_context
        )
        
        # Epic summary
        summary = f"""🎯 EXPERT DEBATE ANALYSIS COMPLETE 🎯
        
        The world's leading experts have clashed over '{topic}' with devastating intellectual force.
        
        Marcus Advocatus wielded the power of progress and possibility.
        Gaius Contradictor unleashed the reality of caution and consequence.
        Lucius Moderator has weighed their arguments on the scales of truth.
        
        The floor falls silent. The decision is yours, but choose knowing that history will judge your wisdom.
        
        May evidence guide your decision. �"""
        
        return DebateResponse(
            topic=topic,
            pro_argument=pro_argument,
            con_argument=con_argument,
            mediator_analysis=mediator_analysis,
            summary=summary
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)