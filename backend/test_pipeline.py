import os
from dotenv import load_dotenv
load_dotenv('d:\\ShadowVault\\ShadowVault\\backend\\.env')

from openai import OpenAI
from google import genai

gemini_key = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=gemini_key)

response = gemini_client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="hi"
)

ai_reply = response.text
print(f"Gemini output: {ai_reply}")

nvidia_key = os.getenv("NVIDIA_API_KEY")
nvidia_client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=nvidia_key
)

completion = nvidia_client.chat.completions.create(
    model="nvidia/llama-3.1-nemotron-safety-guard-8b-v3",
    messages=[{"role": "user", "content": ai_reply}],
    stream=False,
)

print(f"Nemotron output: {completion.choices[0].message.content}")
