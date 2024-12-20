'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import type { Retailer } from '@/types/database.types';
import { createAffiliateLink } from '@/lib/utils';

interface RetailerCardProps {
  retailer: Retailer;
}

export default function RetailerCard({ retailer }: RetailerCardProps) {
  const { user } = useAuth();

  const handleShare = async () => {
    if (!user) {
      // Handle not logged in state - maybe show a login modal
      alert('Please sign in to share affiliate links');
      return;
    }

    // For testing, let's create some dummy product URLs based on retailer name
    let testUrl = retailer.base_url;
    
    // Add a dummy product path
    switch(retailer.name.toLowerCase()) {
      case 'amazon':
        testUrl = 'https://www.amazon.com/dp/B08N5KWB9H';
        break;
      case 'wayfair':
        testUrl = 'https://www.wayfair.com/furniture/pdp/sofa-W001234567';
        break;
      case 'target':
        testUrl = 'https://www.target.com/p/chair/-/A-12345678';
        break;
      case 'walmart':
        testUrl = 'https://www.walmart.com/ip/product/123456789';
        break;
      default:
        testUrl = `${retailer.base_url}/product/test-item`;
    }

    const affiliateUrl = createAffiliateLink('user123', testUrl, retailer.name);
    await navigator.clipboard.writeText(affiliateUrl);
    
    // Show the generated URL in an alert for testing
    alert(`Affiliate link copied to clipboard!\n\nOriginal URL: ${testUrl}\nAffiliate URL: ${affiliateUrl}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        {retailer.logo_url && (
          <Image
            src={retailer.logo_url}
            alt={`${retailer.name} logo`}
            fill
            className="object-contain p-4"
          />
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-black">{retailer.name}</h3>
        <p className="text-gray-600 mb-4">
          Earn up to {retailer.commission_rate}% commission
        </p>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleShare}
          >
            Share & Earn
          </Button>
        </div>
      </div>
    </div>
  );
}
