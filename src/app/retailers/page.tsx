'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import RetailerCard from '@/components/retailers/RetailerCard';
import { useEffect, useState } from 'react';
import type { Retailer } from '@/types/database.types';

export default function RetailersPage() {
  const supabase = createClientComponentClient();
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRetailers() {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('retailers')
          .select('*')
          .eq('active', true)
          .order('name');

        if (error) {
          console.log('Error fetching retailers:', error);
          setError(error.message);
          return;
        }

        // Log raw data
        console.log('Raw data length:', data?.length);
        console.log('Raw data:', JSON.stringify(data, null, 2));

        // Validate the data matches our type
        const validRetailers = data?.filter((item): item is Retailer => {
          if (!item || typeof item !== 'object') {
            console.log('Invalid item (not an object):', item);
            return false;
          }

          const typeChecks = {
            hasId: typeof item?.id === 'string',
            hasName: typeof item?.name === 'string',
            hasBaseUrl: typeof item?.base_url === 'string',
            hasValidLogo: item?.logo_url === null || typeof item?.logo_url === 'string',
            hasAffiliateProgram: typeof item?.affiliate_program === 'string',
            hasCommissionRate: typeof item?.commission_rate === 'number',
            hasActive: typeof item?.active === 'boolean'
          };

          const failedChecks = Object.entries(typeChecks)
            .filter(([_, passed]) => !passed)
            .map(([field]) => field);

          if (failedChecks.length > 0) {
            console.log('Invalid retailer data for:', item?.name || 'unknown retailer');
            console.log('Failed checks:', failedChecks);
            console.log('Item data:', item);
          }

          return failedChecks.length === 0;
        });

        if (!validRetailers) {
          console.log('No retailers array returned from filter');
          setRetailers([]);
          return;
        }

        console.log('Valid retailers count:', validRetailers.length);
        if (validRetailers.length > 0) {
          console.log('First valid retailer:', validRetailers[0]);
          console.log('All retailer names:', validRetailers.map(r => r.name).join(', '));
        } else {
          console.log('No valid retailers found');
        }

        setRetailers(validRetailers);
      } catch (err) {
        console.log('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchRetailers();
  }, [supabase]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-black">Partner Retailers</h1>
        <div>Loading retailers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-black">Partner Retailers</h1>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!retailers || retailers.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-black">Partner Retailers</h1>
        <div>No retailers found. Please add some retailers to the database.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-black">Partner Retailers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {retailers.map((retailer) => {
          try {
            console.log('About to render retailer:', {
              id: retailer?.id,
              name: retailer?.name,
              hasAllFields: !!(
                retailer?.id &&
                retailer?.name &&
                retailer?.base_url &&
                retailer?.affiliate_program &&
                typeof retailer?.commission_rate === 'number'
              )
            });
            
            return (
              <RetailerCard key={retailer.id} retailer={retailer} />
            );
          } catch (err) {
            console.log('Error rendering retailer:', err);
            return null;
          }
        })}
      </div>
    </div>
  );
}
