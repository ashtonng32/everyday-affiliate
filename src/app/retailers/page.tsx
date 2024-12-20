import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import RetailerCard from '@/components/retailers/RetailerCard';
import { Button } from '@/components/ui/button';

export default async function RetailersPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: retailers } = await supabase
    .from('retailers')
    .select('*')
    .eq('active', true)
    .order('name');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-black">Partner Retailers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {retailers?.map((retailer) => (
          <RetailerCard key={retailer.id} retailer={retailer} />
        ))}
      </div>
    </div>
  );
}
