
import { createBrowserClient } from '@supabase/ssr'

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // During build time, environment variables might not be available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. Backend functionality will be disabled.");
    
    // Return a mock client for build time
    return {
      auth: {
        signUp: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        exchangeCodeForSession: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      }
    } as any;
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch (error) {
    console.error('Invalid Supabase URL format:', supabaseUrl);
    // Return mock client for invalid URL
    return {
      auth: {
        signUp: () => Promise.resolve({ error: new Error('Invalid Supabase URL') }),
        signInWithPassword: () => Promise.resolve({ error: new Error('Invalid Supabase URL') }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        exchangeCodeForSession: () => Promise.resolve({ error: new Error('Invalid Supabase URL') }),
      }
    } as any;
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        flowType: 'pkce'
      }
    });
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    // Return mock client on error
    return {
      auth: {
        signUp: () => Promise.resolve({ error: new Error('Supabase client creation failed') }),
        signInWithPassword: () => Promise.resolve({ error: new Error('Supabase client creation failed') }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        exchangeCodeForSession: () => Promise.resolve({ error: new Error('Supabase client creation failed') }),
      }
    } as any;
  }
}

const supabase = createSupabaseClient();

export default supabase;
