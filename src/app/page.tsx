import { createClient } from '@supabase/supabase-js';
import RetailerCard from '@/components/retailers/RetailerCard';
import { redirect } from 'next/navigation';

export default async function Home() {
  redirect('/retailers');
}
