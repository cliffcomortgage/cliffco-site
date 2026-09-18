"""
Step 8 — Test your Google Ads API connection.

Run after your developer token has been approved (Step 3 email arrived).

    pip install google-ads python-dotenv
    python3 test_connection.py

Success: prints your campaigns.
Error "not approved for production": token still pending — wait for the email.
"""

from dotenv import load_dotenv
import os
from google.ads.googleads.client import GoogleAdsClient

load_dotenv()

config = {
    "developer_token": os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN"),
    "client_id": os.getenv("GOOGLE_ADS_CLIENT_ID"),
    "client_secret": os.getenv("GOOGLE_ADS_CLIENT_SECRET"),
    "refresh_token": os.getenv("GOOGLE_ADS_REFRESH_TOKEN"),
    "login_customer_id": os.getenv("GOOGLE_ADS_LOGIN_CUSTOMER_ID"),
    "use_proto_plus": True,
}

client = GoogleAdsClient.load_from_dict(config)
ga_service = client.get_service("GoogleAdsService")

customer_id = os.getenv("GOOGLE_ADS_CUSTOMER_ID")
query = """
    SELECT campaign.id, campaign.name, campaign.status
    FROM campaign
    LIMIT 5
"""

response = ga_service.search(customer_id=customer_id, query=query)
print("\n✓ Connection works. First 5 campaigns:\n")
for row in response:
    print(f"  · {row.campaign.name} ({row.campaign.status.name})")
