import os
from dotenv import load_dotenv
from google import genai

env_path = os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')
load_dotenv(env_path)

gemini_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_key)

try:
    print("Testing gemini-3-flash-preview...")
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents="Say hello!"
    )
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
