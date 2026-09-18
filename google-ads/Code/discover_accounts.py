"""
discover_accounts.py — List all Google Ads accounts accessible to your credentials.

Shows each account's ID, name, and whether it's a Manager (MCC) account.
Use this to identify which ID goes in GOOGLE_ADS_LOGIN_CUSTOMER_ID (the MCC)
vs GOOGLE_ADS_CUSTOMER_ID (your real ad account).

Run:
    pip install google-ads python-dotenv
    python discover_accounts.py
"""

import os
import urllib.request
import urllib.parse
import json
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / ".env")

DEV_TOKEN = os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN")
CLIENT_ID = os.getenv("GOOGLE_ADS_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_ADS_CLIENT_SECRET")
REFRESH_TOKEN = os.getenv("GOOGLE_ADS_REFRESH_TOKEN")


def get_access_token():
    data = urllib.parse.urlencode({
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": REFRESH_TOKEN,
        "grant_type": "refresh_token",
    }).encode()
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=data)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())["access_token"]


def api_get(url, access_token, login_customer_id=None):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "developer-token": DEV_TOKEN,
        "Content-Type": "application/json",
    }
    if login_customer_id:
        headers["login-customer-id"] = login_customer_id
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read()), None
    except urllib.error.HTTPError as e:
        return None, json.loads(e.read())


def api_post(url, body, access_token, login_customer_id=None):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "developer-token": DEV_TOKEN,
        "Content-Type": "application/json",
    }
    if login_customer_id:
        headers["login-customer-id"] = login_customer_id
    data = json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read()), None
    except urllib.error.HTTPError as e:
        return None, json.loads(e.read())


def main():
    print("\nFetching access token...")
    token = get_access_token()

    # List all directly accessible customers
    data, err = api_get(
        "https://googleads.googleapis.com/v20/customers:listAccessibleCustomers",
        token,
    )
    if err:
        print(f"✗ Error listing customers: {err}")
        return

    resource_names = data.get("resourceNames", [])
    customer_ids = [r.split("/")[1] for r in resource_names]
    print(f"\nFound {len(customer_ids)} accessible account(s):\n")

    for cid in customer_ids:
        result, err = api_post(
            f"https://googleads.googleapis.com/v20/customers/{cid}/googleAds:search",
            {"query": "SELECT customer.id, customer.descriptive_name, customer.manager FROM customer LIMIT 1"},
            token,
            login_customer_id=cid,
        )
        if result and result.get("results"):
            c = result["results"][0]["customer"]
            role = "MANAGER (MCC)" if c.get("manager") else "Ad Account"
            print(f"  {c['id']:>15}  {role:<18}  {c.get('descriptiveName', '—')}")
        else:
            err_code = (err or {}).get("error", {}).get("details", [{}])[0].get("errors", [{}])[0].get("errorCode", {})
            print(f"  {cid:>15}  (token not yet approved for production — {list(err_code.values())[0] if err_code else 'unknown error'})")

    print(f"\n→ Set GOOGLE_ADS_LOGIN_CUSTOMER_ID to the MANAGER account ID")
    print(f"→ Set GOOGLE_ADS_CUSTOMER_ID to the Ad Account ID")


if __name__ == "__main__":
    main()
