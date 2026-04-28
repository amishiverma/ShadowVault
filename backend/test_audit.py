from google import genai
import sys

client = genai.Client(api_key="AIzaSyAoUIGDIsXJV8zXqSkx5FLXHHP374J1aYc")

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
