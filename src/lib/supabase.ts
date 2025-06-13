
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment check:');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);
console.log('All env vars:', import.meta.env);

// Temporary fallback for development - this will be replaced with actual values
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder-key';

const finalUrl = supabaseUrl || fallbackUrl;
const finalKey = supabaseAnonKey || fallbackKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not found. Using fallback values.');
  console.warn('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your Supabase integration.');
}

export const supabase = createClient<Database>(finalUrl, finalKey);

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
