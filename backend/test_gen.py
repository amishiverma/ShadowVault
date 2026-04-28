from google import genai
import sys

import os
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say hello"
    )
    print("SUCCESS 2.5-flash:", response.text)
except Exception as e:
    print("ERROR 2.5-flash:", str(e))

try:
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Say hello"
    )
    print("SUCCESS 2.0-flash:", response.text)
except Exception as e:
    print("ERROR 2.0-flash:", str(e))

