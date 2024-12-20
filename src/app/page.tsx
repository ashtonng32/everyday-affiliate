import { createClient } from '@supabase/supabase-js';
import RetailerCard from '@/components/retailers/RetailerCard';

export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: retailers } = await supabase
    .from('retailers')
    .select('*')
    .eq('active', true)
    .order('name');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Partner Retailers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {retailers?.map((retailer) => (
          <RetailerCard key={retailer.id} retailer={retailer} />
        ))}
      </div>
    </div>
  );
}
