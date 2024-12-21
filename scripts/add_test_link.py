import os
from dotenv import load_dotenv
from supabase import create_client
from datetime import datetime, timedelta

# Load environment variables
load_dotenv('../.env.local')

# Configuration
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

print("URL:", SUPABASE_URL)
print("Key exists:", bool(SUPABASE_KEY))
if SUPABASE_KEY:
    print("Key length:", len(SUPABASE_KEY))
print("All env vars:", {k: v for k, v in os.environ.items() if 'SUPABASE' in k.upper() or 'ROLE' in k.upper()})

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Test data
test_link = {
    'user_id': 'fd24f863-3752-4074-a41f-abd6045e9652',
    'short_link': 'https://amzn.to/3DuQL7t',
    'last_clicked_at': (datetime.now() - timedelta(minutes=5)).isoformat(),  # Set as clicked 5 minutes ago
    'clicks_count': 1
}

# Insert the test link
result = supabase.table('amazon_affiliate_links').insert(test_link).execute()
print("Link added successfully:", result.data)
