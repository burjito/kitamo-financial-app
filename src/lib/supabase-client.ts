
import { createBrowserClient } from '@supabase/ssr'

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. Backend functionality will be disabled.");
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

const supabase = createSupabaseClient();

export default supabase;
