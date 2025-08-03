import asyncio
import os
from pinecone import Pinecone
import requests
from google.oauth2 import service_account
import google.auth.transport.requests
from scrape import scrape_courses
from datetime import datetime, timedelta
from dotenv import load_dotenv
load_dotenv()

# --- Gemini Embedding Setup ---
PROJECT_ID = "caramel-world-456503-r3"
LOCATION = "us-central1"
MODEL = "gemini-embedding-001"
KEY_FILE = "../vertex-key.json"  # Path to your service account key

# --- Pinecone Setup ---
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
INDEX_NAME = "brown-courses"  # Change if you use a different index name


def get_access_token():
    credentials = service_account.Credentials.from_service_account_file(
        KEY_FILE,
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )
    auth_req = google.auth.transport.requests.Request()
    credentials.refresh(auth_req)
    return credentials.token

def get_access_token_cached():
    if (
        not hasattr(get_access_token_cached, "token") or
        not hasattr(get_access_token_cached, "expiry") or
        datetime.utcnow() >= get_access_token_cached.expiry
    ):
        credentials = service_account.Credentials.from_service_account_file(
            KEY_FILE,
            scopes=["https://www.googleapis.com/auth/cloud-platform"],
        )
        auth_req = google.auth.transport.requests.Request()
        credentials.refresh(auth_req)
        get_access_token_cached.token = credentials.token
        # credentials.expiry is a datetime object (UTC)
        # Refresh 5 minutes before expiry to be safe
        get_access_token_cached.expiry = credentials.expiry - timedelta(minutes=5)
    return get_access_token_cached.token

def get_embedding(text):
    access_token = get_access_token_cached()
    url = f"https://{LOCATION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL}:predict"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    data = {"instances": [{"content": text}]}
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    embedding = response.json()["predictions"][0]["embeddings"]["values"]
    return embedding

async def main():
    # 1. Scrape all courses
    print("Scraping courses...")
    courses = await scrape_courses()  # No max_courses argument, process all
    print(f"Scraped {len(courses)} courses.")

    # 2. Initialize Pinecone (new API)
    print("Initializing Pinecone...")
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(INDEX_NAME)

    # 3. For each course, generate embedding and upsert to Pinecone
    for course in courses:
        text = f"{course['title']} {course['description']}"
        try:
            embedding = get_embedding(text)
            index.upsert([
                (
                    course["id"],
                    embedding,
                    {
                        "title": course["title"],
                        "description": course["description"],
                        "department": course["department"]
                    }
                )
            ])
            # print(f"Upserted {course['id']} to Pinecone.")
        except Exception as e:
            print(f"Error processing {course['id']}: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 