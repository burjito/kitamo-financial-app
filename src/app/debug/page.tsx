"use client";

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase-client';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const getDebugInfo = async () => {
      const info: any = {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
        supabaseKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        supabaseClientAvailable: !!supabase,
        supabaseAuthAvailable: !!supabase?.auth,
        timestamp: new Date().toISOString()
      };

      // Test a simple Supabase call
      try {
        const { data, error } = await supabase.auth.getSession();
        info.sessionTest = { success: !error, error: error?.message };
      } catch (err: any) {
        info.sessionTest = { success: false, error: err.message };
      }

      setDebugInfo(info);
    };

    getDebugInfo();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
