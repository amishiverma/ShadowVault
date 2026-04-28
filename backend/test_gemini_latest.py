import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
from google import genai

gemini_key = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=gemini_key)

try:
    response = gemini_client.models.generate_content(
        model="gemini-flash-latest",
        contents="hello"
    )
    print("latest success!")
except Exception as e:
    print(f"latest ERROR: {e}")
