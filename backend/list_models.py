import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
from google import genai

gemini_key = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=gemini_key)

try:
    models = gemini_client.models.list()
    for m in models:
        print(m.name)
except Exception as e:
    print(f"List ERROR: {e}")
