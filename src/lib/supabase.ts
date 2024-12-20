import { createClient } from '@supabase/supabase-js';

// Temporarily hardcoding these values for testing
const supabaseUrl = 'https://ufvjmtayhtcwgixxhjly.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdmptdGF5aHRjd2dpeHhoamx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MTg5NDAsImV4cCI6MjA1MDI5NDk0MH0.Hp7spFdO8V0-m40Cwzrzgilw-ZN-LNcydzTlzUy_q1U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  }
});
