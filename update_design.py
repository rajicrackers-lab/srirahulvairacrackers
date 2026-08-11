import requests
import json

# Supabase configuration extracted from environment.ts
SUPABASE_URL = "https://dybhvoykvnxrrtcolqva.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5Ymh2b3lrdm54cnJ0Y29scXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NDUwODgsImV4cCI6MjA1ODMyMTA4OH0.dz5k3rzjfWtM23v90lFFagB41bWaiLFmrTcuWgtYuXQ"
STORE_ID = "81534506-3ced-435e-9f29-debcfb9c6b5e"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# The payload with updated design details tailored for Sri Rahul Vaira Crackers
# Includes responsive attributes where possible via the Angular bindings.
data = {
    "brandText": "Sri Rahul Vaira Crackers",
    "pageTitle": "Sri Rahul Vaira Crackers",
    "banner_design": {
        "title": {
            "text": "SRI RAHUL VAIRA CRACKERS",
            "fontSize": 3,
            "color": "#FFD700",
            "fontWeight": "bold",
            "textShadow": "2px 2px 4px rgba(0,0,0,0.8)",
            "textAlign": "center"
        },
        "subtitle": {
            "text": "PREMIUM FIREWORKS FROM SIVAKASI",
            "fontSize": 2,
            "color": "#ffffff",
            "textShadow": "1px 1px 2px rgba(0,0,0,0.5)",
            "textAlign": "center"
        },
        "button": {
            "text": "SHOP NOW"
        },
        "background": {
            "type": "gradient",
            "gradient": "linear-gradient(135deg, #ff3019 0%, #990000 100%)"
        },
        "image": {
            "url": "assets/banner.png", 
            "width": 300,
            "position": "center"
        }
    }
}

def update_design_details():
    # Update the row for this specific store_id in the 'details' table
    url = f"{SUPABASE_URL}/rest/v1/details?store_id=eq.{STORE_ID}"
    
    print(f"Updating design details at {url}...")
    response = requests.patch(
        url,
        json=data,
        headers=headers
    )

    if response.status_code in [200, 204]:
        print("Successfully updated design details for Sri Rahul Vaira Crackers!")
        print("Response:", json.dumps(response.json(), indent=2))
    else:
        print(f"Failed to update design details. Status code: {response.status_code}")
        print("Error:", response.text)

if __name__ == "__main__":
    update_design_details()
