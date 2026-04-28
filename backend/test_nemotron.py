import os
from dotenv import load_dotenv
load_dotenv('d:\\ShadowVault\\ShadowVault\\backend\\.env')

from openai import OpenAI

nvidia_key = os.getenv("NVIDIA_API_KEY")
nvidia_client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=nvidia_key
)

completion = nvidia_client.chat.completions.create(
    model="nvidia/llama-3.1-nemotron-safety-guard-8b-v3",
    messages=[{"role": "user", "content": "hi"}],
    stream=False,
)

print(completion.choices[0].message.content)
