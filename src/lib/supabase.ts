
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Use the actual Supabase project credentials
const supabaseUrl = 'https://yrywjbxqlqpdzrudfupm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyeXdqYnhxbHFwZHpydWRmdXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNjM0MTMsImV4cCI6MjA2MzYzOTQxM30.tHBkiztnuUhjLLwq1zraM0XpG1MvLPON40m3jdNIEkI';

console.log('Supabase configuration:');
console.log('URL:', supabaseUrl);
console.log('Key configured:', !!supabaseAnonKey);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    console.log('Supabase connection test:', { data, error });
    return { connected: !error, error };
  } catch (err) {
    console.error('Supabase connection failed:', err);
    return { connected: false, error: err };
  }
};
