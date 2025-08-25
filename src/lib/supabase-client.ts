
import { createBrowserClient } from '@supabase/ssr'

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // Validate environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase environment variables missing");
    return createMockClient('Environment variables not configured');
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch (error) {
    console.error('❌ Invalid Supabase URL format:', supabaseUrl);
    return createMockClient('Invalid Supabase URL format');
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true, // Enable for email verification
      }
    });
  } catch (error) {
    console.error('💥 Failed to create Supabase client:', error);
    return createMockClient('Supabase client creation failed');
  }
}

function createMockClient(reason: string) {
  const mockError = new Error(`Supabase not available: ${reason}`);
  
  return {
    auth: {
      signUp: () => Promise.resolve({ error: mockError }),
      signInWithPassword: () => Promise.resolve({ error: mockError }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      exchangeCodeForSession: () => Promise.resolve({ error: mockError }),
      verifyOtp: () => Promise.resolve({ error: mockError }),
    }
  } as any;
}

const supabase = createSupabaseClient();

export default supabase;
