import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
from google import genai

gemini_key = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=gemini_key)

try:
    response = gemini_client.models.generate_content(
        model="gemini-2.0-flash",
        contents="hello"
    )
    print("2.0 flash success!")
except Exception as e:
    print(f"2.0 flash ERROR: {e}")

try:
    response = gemini_client.models.generate_content(
        model="gemini-1.5-flash",
        contents="hello"
    )
    print("1.5 flash success!")
except Exception as e:
    print(f"1.5 flash ERROR: {e}")
