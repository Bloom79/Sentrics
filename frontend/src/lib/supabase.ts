import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://zcudjmlgfwhecjsybrl.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdWRqbWxnZndoZWNqc3V5YnJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxOTcwMjUsImV4cCI6MjA1MTc3MzAyNX0.y6h_tUWvXfoeCMG36tdL20DfBqKhsKPqq8aaw10rie4";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Export a default instance for backwards compatibility
export default supabase; 