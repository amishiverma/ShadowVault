from google import genai
client = genai.Client(api_key="AIzaSyAoUIGDIsXJV8zXqSkx5FLXHHP374J1aYc")
for m in client.models.list():
    print(m.name)
