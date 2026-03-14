import os
import json
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env relative to this script
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

URL = os.getenv("SUPABASE_URL")
ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Use service key if available to bypass RLS, otherwise fallback to anon key
KEY = SERVICE_KEY if SERVICE_KEY else ANON_KEY

if not URL or not KEY:
    print("Error: SUPABASE_URL and either SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY must be set in .env")
    exit(1)
supabase = create_client(URL, KEY)

INPUT_FILE = Path(__file__).parent / "unsw_units_raw.json"

def push_data():
    if not INPUT_FILE.exists():
        print(f"Error: {INPUT_FILE} not found. Run the scraper first.")
        return

    with open(INPUT_FILE, "r") as f:
        units = json.load(f)

    print(f"Pushing {len(units)} units to Supabase...")

    for unit in units:
        if "error" in unit:
            print(f"Skipping {unit['code']} due to scrape error.")
            continue

        # Prepare payload matching 'unit_knowledge' table schema
        payload = {
            "unit_code": unit.get("code"),
            "unit_title": unit.get("title"),
            "description": unit.get("description"),
            "skills": unit.get("learning_outcomes", [])
        }

        try:
            # We use upsert on the 'unit_code' column (primary key)
            response = supabase.table("unit_knowledge").upsert(payload, on_conflict="unit_code").execute()
            print(f"  ✓ Pushed {unit['code']}")
        except Exception as e:
            print(f"  ✗ Failed to push {unit['code']}: {e}")

if __name__ == "__main__":
    push_data()