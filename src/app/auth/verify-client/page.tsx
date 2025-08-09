"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import supabase from "@/lib/supabase-client";

function VerifyClientContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleVerification = async () => {
      const code = searchParams.get('code');
      
      if (!code) {
        setStatus('error');
        setErrorMessage('No verification code provided');
        return;
      }

      try {
        if (!supabase || !supabase.auth) {
          throw new Error('Authentication service is not available');
        }

        console.log('Attempting client-side verification with code:', code);

        // Use client-side PKCE verification
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          console.error('Client-side verification error:', error);
          setStatus('error');
          setErrorMessage(error.message || 'Verification failed');
          return;
        }

        if (data.user) {
          setStatus('success');
          console.log('Verification successful, user:', data.user.email);
          // Redirect to home after a short delay
          setTimeout(() => {
            router.push('/home');
          }, 2000);
        } else {
          setStatus('error');
          setErrorMessage('Verification succeeded but no user data received');
        }
      } catch (error: any) {
        console.error('Unexpected verification error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'An unexpected error occurred');
      }
    };

    handleVerification();
  }, [searchParams, router]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl text-blue-600">Verifying Email</CardTitle>
              <CardDescription>
                Please wait while we verify your email address...
              </CardDescription>
            </CardHeader>
          </Card>
        );

      case 'success':
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Email Verified!</CardTitle>
              <CardDescription>
                Your email has been successfully verified. Redirecting you to your dashboard...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Welcome to KitaMo! You can now access all features.
                </div>
                <Button asChild className="w-full">
                  <Link href="/home">
                    Continue to Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'error':
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">Verification Failed</CardTitle>
              <CardDescription>
                There was an issue verifying your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-muted-foreground bg-red-50 p-3 rounded-lg border border-red-200">
                {errorMessage}
              </div>
              
              <div className="space-y-2">
                <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary">
                  <Link href="/signup">
                    Try Signing Up Again
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">
                    Already verified? Try Login
                  </Link>
                </Button>
              </div>

              <div className="text-center">
                <Link 
                  href="/" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      {renderContent()}
    </div>
  );
}

export default function VerifyClientPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading verification...</p>
        </div>
      </div>
    }>
      <VerifyClientContent />
    </Suspense>
  );
}
