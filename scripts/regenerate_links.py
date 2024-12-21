import os
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
from supabase import create_client, Client
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv
from loguru import logger
import sys
import asyncio

# Setup logging
logger.remove()
logger.add(
    "link_regeneration.log",
    rotation="1 day",
    retention="7 days",
    level="INFO",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}"
)
logger.add(sys.stderr, level="INFO")

# Load environment variables
logger.info("Current working directory: " + os.getcwd())
logger.info("Loading .env from current directory")
load_dotenv(override=True)  # Force override any existing values

# Debug: Print all environment variables
print("All environment variables:", dict(os.environ))

# Configuration
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
AMAZON_EMAIL = os.getenv('AMAZON_EMAIL')
AMAZON_PASSWORD = os.getenv('AMAZON_PASSWORD')

# Debug: Print all environment variables (without sensitive info)
logger.info("Environment variables loaded:")
logger.info(f"SUPABASE_URL: {SUPABASE_URL}")
logger.info(f"AMAZON_EMAIL: {AMAZON_EMAIL}")

# Verify environment variables
if not AMAZON_EMAIL or AMAZON_EMAIL == "your_amazon_associates_email":
    raise ValueError("AMAZON_EMAIL not set correctly in .env file")
if not AMAZON_PASSWORD:
    raise ValueError("AMAZON_PASSWORD not set in .env file")

def get_supabase_client() -> Client:
    """Initialize Supabase client"""
    if not all([SUPABASE_URL, SUPABASE_KEY]):
        raise ValueError("Missing Supabase credentials")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def login_to_amazon(page):
    """Handle Amazon Associates login through SiteStripe"""
    try:
        # Go directly to the sign-in page
        page.goto('https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2F%3Fref_%3Dnav_ya_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0')
        page.wait_for_load_state('networkidle', timeout=60000)
        
        # Wait for and fill in email
        page.wait_for_selector('#ap_email', timeout=60000)
        page.fill('#ap_email', AMAZON_EMAIL)
        page.wait_for_selector('#continue', timeout=60000)
        page.click('#continue')
        
        # Wait for and fill in password
        page.wait_for_selector('#ap_password', timeout=60000)
        page.fill('#ap_password', AMAZON_PASSWORD)
        page.wait_for_selector('#signInSubmit', timeout=60000)
        page.click('#signInSubmit')
        
        # Wait for login to complete and redirect
        page.wait_for_load_state('networkidle', timeout=60000)
        page.wait_for_load_state('domcontentloaded', timeout=60000)
        
        # Go to a product page to check for SiteStripe
        page.goto('https://www.amazon.com/dp/B07ZPML7NP')  # Sample product
        page.wait_for_load_state('networkidle', timeout=60000)
        
        # Wait for SiteStripe's Get Link button to appear
        page.wait_for_selector('#amzn-ss-get-link-button', timeout=60000)
        logger.info("Successfully logged into Amazon")
        
    except Exception as e:
        logger.error(f"Failed to login to Amazon: {str(e)}")
        raise

def get_new_sitestripe_link(page, original_url):
    """Generate new SiteStripe short link for a product"""
    try:
        # Navigate to the product page
        page.goto(original_url)
        page.wait_for_load_state('networkidle', timeout=60000)
        
        # Wait for SiteStripe to load and click Get Link
        page.wait_for_selector('#amzn-ss-get-link-button', timeout=60000)
        page.click('#amzn-ss-get-link-button')
        
        # Wait for the textarea to appear and get its value
        page.wait_for_selector('#amzn-ss-text-shortlink-textarea', timeout=60000)
        short_link = page.evaluate('() => document.querySelector("#amzn-ss-text-shortlink-textarea").value')
        
        if not short_link or not short_link.startswith('https://amzn.to/'):
            raise ValueError(f"Invalid short link generated: {short_link}")
        
        logger.info(f"Successfully generated new short link: {short_link}")
        return short_link
        
    except Exception as e:
        logger.error(f"Failed to generate new link for {original_url}: {str(e)}")
        raise

def process_clicked_links(supabase: Client):
    """Process all clicked links and generate new ones"""
    try:
        # Get clicked links from last 24 hours
        response = supabase.table('amazon_affiliate_links')\
            .select('*')\
            .gt('last_clicked_at', (datetime.now() - timedelta(days=1)).isoformat())\
            .execute()
        
        clicked_links = response.data
        logger.info(f"Found {len(clicked_links)} links to process")
        
        if not clicked_links:
            logger.info("No links to process")
            return
        
        with sync_playwright() as p:
            # Launch browser
            browser = p.chromium.launch(headless=False)
            context = browser.new_context()
            page = context.new_page()
            
            # Login to Amazon Associates
            login_to_amazon(page)
            
            # Process each clicked link
            for link in clicked_links:
                try:
                    new_link = get_new_sitestripe_link(page, link['short_link'])
                    
                    # Update database with new link
                    supabase.table('amazon_affiliate_links')\
                        .update({
                            'short_link': new_link,
                            'last_clicked_at': None,
                            'updated_at': datetime.now().isoformat()
                        })\
                        .eq('id', link['id'])\
                        .execute()
                    
                    logger.info(f"Updated link ID {link['id']} with new short link")
                    
                except Exception as e:
                    logger.error(f"Error processing link {link['id']}: {str(e)}")
                    continue
            
            browser.close()
            
    except Exception as e:
        logger.error(f"Failed to process clicked links: {str(e)}")
        raise

def main():
    """Main execution function"""
    logger.info("Starting link regeneration process")
    
    try:
        # Initialize Supabase client
        supabase = get_supabase_client()
        
        # Process clicked links
        process_clicked_links(supabase)
        
        logger.info("Link regeneration process completed successfully")
        
    except Exception as e:
        logger.error(f"Link regeneration process failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
