'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { Retailer } from '@/types/database.types';

interface RetailerCardProps {
  retailer: Retailer;
}

export default function RetailerCard({ retailer }: RetailerCardProps) {
  console.log('RetailerCard received props:', { retailer });

  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Validate retailer data
  if (!retailer || typeof retailer !== 'object') {
    console.log('Invalid retailer data:', retailer);
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-500">Invalid retailer data</div>
      </div>
    );
  }

  // Check required fields
  if (!retailer.id || !retailer.name) {
    console.log('Missing required fields:', {
      hasId: !!retailer.id,
      hasName: !!retailer.name,
      retailer
    });
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-500">Missing required retailer data</div>
      </div>
    );
  }

  useEffect(() => {
    console.log('RetailerCard mounted for retailer:', {
      id: retailer?.id,
      name: retailer?.name,
      base_url: retailer?.base_url,
      affiliate_program: retailer?.affiliate_program,
      commission_rate: retailer?.commission_rate,
      logo_url: retailer?.logo_url
    });
  }, [retailer]);

  const handleShare = async () => {
    if (!user) {
      alert('Please sign in to share affiliate links');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get the affiliate link with all fields to debug
      const { data, error: queryError } = await supabase
        .from('amazon_affiliate_links')
        .select('*')
        .limit(1)
        .single();

      console.log('Database response:', {
        data,
        error: queryError
      });

      if (queryError) {
        console.error('Query error:', queryError);
        throw new Error('Could not fetch affiliate link');
      }

      if (!data) {
        throw new Error('No affiliate link found');
      }

      // Log the exact data structure
      console.log('Link data:', {
        id: data.id,
        user_id: data.user_id,
        short_link: data.short_link,
        original_url: data.original_url,
        created_at: data.created_at
      });

      if (!data.short_link) {
        throw new Error('Invalid affiliate link format');
      }

      // Open the short link in a new tab
      console.log('Opening link:', data.short_link);
      window.open(data.short_link, '_blank');
      
    } catch (error) {
      console.error('Error in handleShare:', error);
      setError(error instanceof Error ? error.message : 'Could not open affiliate link');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{retailer.name}</h3>
        {retailer.logo_url && !imageError && (
          <div className="w-12 h-12 relative">
            <Image
              src={retailer.logo_url}
              alt={`${retailer.name} logo`}
              fill
              className="rounded-full object-contain"
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </div>
      
      {typeof retailer.commission_rate === 'number' && (
        <p className="text-sm text-gray-600 mb-4">
          Commission Rate: {retailer.commission_rate}%
        </p>
      )}

      <Button 
        onClick={handleShare}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Opening Link...
          </>
        ) : (
          'Share & Earn'
        )}
      </Button>
    </div>
  );
}
