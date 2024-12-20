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

    const affiliateUrl = createAffiliateLink(user.id, retailer.base_url, retailer.name);
    await navigator.clipboard.writeText(affiliateUrl);
    // TODO: Add a toast notification here
    alert('Affiliate link copied to clipboard!');
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
            className="w-full"
            variant="default"
            onClick={() => window.open(retailer.base_url, '_blank')}
          >
            Visit Store
          </Button>
          
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
