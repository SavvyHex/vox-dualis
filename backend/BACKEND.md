# Backend
The backend for the ethical debate arena where AI agents engage in structured debates.

## Architecture

The backend features three distinct AI agents:

1. *Marcus Advocatus (Pro Agent)* - Argues FOR the debate topic
2. *Gaius Contradictor (Con Agent)* - Argues AGAINST the debate topic  
3. *Lucius Moderator (Mediator Agent)* - Fact-checks and provides balanced analysis

## Setup

1. Install dependencies:
   
   pip install -r requirements.txt
   

2. Create .env file from template:
   
   cp .env.example .env
   

3. Add your three Google Gemini API keys to the .env file

4. Run the server:
   
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   

## API Endpoints

- GET / - Welcome message
- POST /debate - Generate a structured debate
- GET /health - Health check

### Example Request

json
{
  "topic": "Should artificial intelligence be regulated by governments?"
}


### Example Response

json
{
  "topic": "Should artificial intelligence be regulated by governments?",
  "pro_argument": "Marcus Advocatus argues...",
  "con_argument": "Gaius Contradictor counters...",
  "mediator_analysis": "Lucius Moderator observes...",
  "summary": "The Senate has heard compelling arguments..."
}


## Roman Theme

All agents are designed with Roman personas to match the "Vox Dualis" (Two Voices) theme, representing the classical tradition of structured debate in the Roman Senate.