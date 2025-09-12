from dotenv import load_dotenv
import os
import google.generativeai as genai
load_dotenv()# Load the .env file
api_key = os.getenv("GOOGLE_API_KEY")# Get the API key from requirements.txt
genai.configure(api_key=api_key)# map the api we're using for the project to the particular api key
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Say hello from Google GenAI!")#test content generation
print(response.text)
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
