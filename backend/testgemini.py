from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GEMINI_API_KEY")
print(f"API Key found: {key[:10]}..." if key else "NO API KEY FOUND")

client = genai.Client(api_key=key)
response = client.models.generate_content(model="gemini-2.0-flash", contents="Say hello")
print(response.text)