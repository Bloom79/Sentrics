// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zcudjmlgfwhecjseybrl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdWRqbWxnZndoZWNqc2V5YnJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxOTcwMjUsImV4cCI6MjA1MTc3MzAyNX0.y6h_tUWvXfoeCMG36tdL20DfBqKhsKPqq8aaw10rie4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);