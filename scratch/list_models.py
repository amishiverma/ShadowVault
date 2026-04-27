import os
from dotenv import load_dotenv
from google import genai

env_path = os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')
load_dotenv(env_path)

gemini_key = os.getenv("GEMINI_API_KEY")
if not gemini_key:
    print("GEMINI_API_KEY not found in .env")
    exit(1)

client = genai.Client(api_key=gemini_key)

try:
    print("Listing models...")
    for model in client.models.list():
        print(f"Name: {model.name}, Supported Actions: {model.supported_actions}")
except Exception as e:
    print(f"Error listing models: {e}")
