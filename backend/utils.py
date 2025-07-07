from openai import OpenAI
from dotenv import load_dotenv
import os

# Load env
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("❌ OPENAI_API_KEY not found")

client = OpenAI(api_key=api_key)

def generate_code_from_prompt(messages: list[dict]) -> str:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # or gpt-4
        messages=messages,
        temperature=0.3,
        max_tokens=1000
    )
    return response.choices[0].message.content.strip()
