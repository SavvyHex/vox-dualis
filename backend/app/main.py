from dotenv import load_dotenv
import os
import google.generativeai as genai
load_dotenv()# Load the .env file
api_key = os.getenv("GOOGLE_API_KEY")# Get the API key from requirements.txt
genai.configure(api_key=api_key)# map the api we're using for the project to the particular api key
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Say hello from Google GenAI!")#test content generation
print(response.text)
