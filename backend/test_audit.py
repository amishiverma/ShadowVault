from google import genai
import sys

import os
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

prompt = """
    As an AI Ethics Auditor, explain these bias detection results to a non-technical stakeholder.
    Highlight the most critical risks and explain why they are harmful.
    
    Audit Results:
    {"status": "WARNING"}
"""

try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    print("SUCCESS:", response.text[:50])
except Exception as e:
    print("ERROR:", str(e))
