"""
auth_and_save.py — Run the Google OAuth flow and save the refresh token to .env.

Reads credentials.json from the parent folder.
Writes GOOGLE_ADS_REFRESH_TOKEN directly into ../.env.

Run:
    pip install google-auth-oauthlib
    python auth_and_save.py
"""

import json
import re
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/adwords"]
ROOT = Path(__file__).parent.parent
CREDS_FILE = ROOT / "credentials.json"
ENV_FILE = ROOT / ".env"


def run():
    if not CREDS_FILE.exists():
        print(f"✗ credentials.json not found at {CREDS_FILE}")
        return

    flow = InstalledAppFlow.from_client_secrets_file(str(CREDS_FILE), SCOPES)
    print("\nOpening browser for Google sign-in...")
    creds = flow.run_local_server(port=0, prompt="consent", access_type="offline")

    refresh_token = creds.refresh_token
    print(f"\n✓ Refresh token obtained: {refresh_token[:20]}...")

    # Write into .env
    env_text = ENV_FILE.read_text(encoding="utf-8") if ENV_FILE.exists() else ""
    if re.search(r"^GOOGLE_ADS_REFRESH_TOKEN=", env_text, re.MULTILINE):
        env_text = re.sub(
            r"^GOOGLE_ADS_REFRESH_TOKEN=.*$",
            f"GOOGLE_ADS_REFRESH_TOKEN={refresh_token}",
            env_text,
            flags=re.MULTILINE,
        )
    else:
        env_text += f"\nGOOGLE_ADS_REFRESH_TOKEN={refresh_token}\n"

    ENV_FILE.write_text(env_text, encoding="utf-8")
    print(f"✓ Saved to {ENV_FILE}")


if __name__ == "__main__":
    run()
