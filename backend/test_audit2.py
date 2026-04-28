from google import genai
import sys

import os
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

prompt = "Explain bias detection to a stakeholder."

for model in ["gemini-flash-latest", "gemini-flash-lite-latest", "gemini-3.1-flash-lite-preview", "gemini-pro-latest"]:
    try:
        response = client.models.generate_content(model=model, contents=prompt)
        print(f"SUCCESS {model}:", response.text[:20])
    except Exception as e:
        print(f"ERROR {model}:", str(e))
