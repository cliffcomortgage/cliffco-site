"""
Step 7 — Generate a Google Ads refresh token.

Run:
    pip install google-auth-oauthlib
    python3 get_refresh_token.py

A browser window opens. Sign in with the Google account that owns
the Ads account, click Allow, then copy the token printed here.

Paste the result into .env as GOOGLE_ADS_REFRESH_TOKEN=...
"""

from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/adwords"]

client_id = input("Paste your CLIENT_ID: ").strip()
client_secret = input("Paste your CLIENT_SECRET: ").strip()

client_config = {
    "installed": {
        "client_id": client_id,
        "client_secret": client_secret,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": ["http://localhost"],
    }
}

flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
creds = flow.run_local_server(port=0, prompt="consent", access_type="offline")

print("\n\n=== YOUR REFRESH TOKEN ===")
print(creds.refresh_token)
print("==========================\n")
print("Paste this into .env as GOOGLE_ADS_REFRESH_TOKEN=...")
