// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://goimexiioeepwiuufmdx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvaW1leGlpb2VlcHdpdXVmbWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzY5MDAsImV4cCI6MjA2NDgxMjkwMH0.WlCIA8XDbzvYxxXFMDYqAclbbWjYuFXDbDPcgQEnLcM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);