'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const TRACKING_SCRIPT = `
  (function() {
    // Store the tracking IDs
    const clickId = localStorage.getItem('ea_click_id');
    const userId = localStorage.getItem('ea_user_id');
    
    // Function to add tracking to links
    function addTrackingToUrl(url) {
      try {
        const urlObj = new URL(url);
        // Preserve Amazon's affiliate tag if it exists
        const tag = urlObj.searchParams.get('tag');
        if (tag) {
          urlObj.searchParams.set('tag', tag);
        }
        // Add our tracking parameters
        if (clickId) urlObj.searchParams.set('ea_click', clickId);
        if (userId) urlObj.searchParams.set('ea_user', userId);
        return urlObj.toString();
      } catch (e) {
        return url;
      }
    }

    // Monitor all link clicks
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (link && link.href.includes('amazon.com')) {
        e.preventDefault();
        const trackedUrl = addTrackingToUrl(link.href);
        window.location.href = trackedUrl;
      }
    }, true);
  })();
`;

export default function RedirectPage() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Store tracking info in localStorage
    const clickId = searchParams.get('click_id');
    const userId = searchParams.get('user_id');
    if (clickId && userId) {
      localStorage.setItem('ea_click_id', clickId);
      localStorage.setItem('ea_user_id', userId);
    }
    
    // Inject our tracking script
    const script = document.createElement('script');
    script.textContent = TRACKING_SCRIPT;
    document.head.appendChild(script);
    
    // Get the Amazon URL and redirect
    const amazonUrl = searchParams.get('url');
    if (amazonUrl) {
      window.location.href = decodeURIComponent(amazonUrl);
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to Amazon...</p>
    </div>
  );
}
