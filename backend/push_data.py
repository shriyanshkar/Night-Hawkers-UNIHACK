import json
from supabase import create_client
from dotenv import load_dotenv
from pathlib import Path

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

def push_clean_data():

    try:
        with open("unsw_units_raw.json", "r", encoding="utf-8") as f:
            units = json.load(f)
    except FileNotFoundError:
        print("❌ Error: Cannot find 'unsw_units_raw.json'. Make sure it's saved in the same folder.")
        return

    TABLE_NAME = "unit_knowledge" 

    print(f"Pushing {len(units)} units to Supabase...")


    for unit in units:
        # Mapping the JSON keys to match your Supabase columns
        payload = {
            "unit_code": unit["code"],          
            "unit_title": unit["title"],        
            "description": unit["description"],
            # Converting the array to a JSON string so it doesn't crash your text column
            "skills": json.dumps(unit["learning_outcomes"]) 
        }
        
        try:
            # Upsert overwrites the old garbage CSS data if the unit_code already exists
            supabase.table(TABLE_NAME).upsert(payload).execute()
            print(f"✅ Cleaned and pushed {unit['code']}")
        except Exception as e:
            print(f"❌ Failed to push {unit['code']}: {e}")

if __name__ == "__main__":
    push_clean_data()