"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import supabase from '@/lib/supabase-client';

interface DebugInfo {
  environment: {
    hasSupabaseUrl: boolean;
    hasSupabaseKey: boolean;
    supabaseUrlLength: number;
    supabaseKeyLength: number;
  };
  client: {
    isAvailable: boolean;
    authAvailable: boolean;
    sessionTest: { success: boolean; error?: string };
  };
  timestamp: string;
}

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runDiagnostics = async () => {
      const info: DebugInfo = {
        environment: {
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
          supabaseKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        },
        client: {
          isAvailable: !!supabase,
          authAvailable: !!supabase?.auth,
          sessionTest: { success: false }
        },
        timestamp: new Date().toISOString()
      };

      // Test Supabase connection
      try {
        const { data, error } = await supabase.auth.getSession();
        info.client.sessionTest = { 
          success: !error, 
          error: error?.message 
        };
      } catch (err: any) {
        info.client.sessionTest = { 
          success: false, 
          error: err.message 
        };
      }

      setDebugInfo(info);
      setLoading(false);
    };

    runDiagnostics();
  }, []);

  const StatusIcon = ({ success }: { success: boolean }) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Running diagnostics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">KitaMo Debug Dashboard</h1>
          <p className="text-gray-600">Authentication & Environment Diagnostics</p>
        </div>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Environment Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span>Supabase URL</span>
                <div className="flex items-center gap-2">
                  <StatusIcon success={debugInfo?.environment.hasSupabaseUrl || false} />
                  <Badge variant={debugInfo?.environment.hasSupabaseUrl ? "default" : "destructive"}>
                    {debugInfo?.environment.hasSupabaseUrl ? `${debugInfo.environment.supabaseUrlLength} chars` : 'Missing'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Supabase Anon Key</span>
                <div className="flex items-center gap-2">
                  <StatusIcon success={debugInfo?.environment.hasSupabaseKey || false} />
                  <Badge variant={debugInfo?.environment.hasSupabaseKey ? "default" : "destructive"}>
                    {debugInfo?.environment.hasSupabaseKey ? `${debugInfo.environment.supabaseKeyLength} chars` : 'Missing'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Supabase Client Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <span>Client Available</span>
                <div className="flex items-center gap-2">
                  <StatusIcon success={debugInfo?.client.isAvailable || false} />
                  <Badge variant={debugInfo?.client.isAvailable ? "default" : "destructive"}>
                    {debugInfo?.client.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Auth Service</span>
                <div className="flex items-center gap-2">
                  <StatusIcon success={debugInfo?.client.authAvailable || false} />
                  <Badge variant={debugInfo?.client.authAvailable ? "default" : "destructive"}>
                    {debugInfo?.client.authAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Session Test</span>
                <div className="flex items-center gap-2">
                  <StatusIcon success={debugInfo?.client.sessionTest.success || false} />
                  <Badge variant={debugInfo?.client.sessionTest.success ? "default" : "destructive"}>
                    {debugInfo?.client.sessionTest.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              </div>
              {debugInfo?.client.sessionTest.error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {debugInfo.client.sessionTest.error}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Raw Debug Data */}
        <Card>
          <CardHeader>
            <CardTitle>Raw Debug Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          Last updated: {debugInfo?.timestamp && new Date(debugInfo.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
