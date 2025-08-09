"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle, ArrowLeft, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";
import supabase from "@/lib/supabase-client";

interface VerificationState {
  status: 'loading' | 'success' | 'error' | 'expired' | 'already_verified';
  message: string;
  details?: string;
}

function VerificationContent() {
  const [state, setState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verifying your email address...'
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get verification parameters
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        console.log('🔍 Verification started with params:', {
          hasCode: !!code,
          hasTokenHash: !!tokenHash,
          hasError: !!error,
          type,
          errorDescription
        });

        // Handle errors from Supabase
        if (error) {
          console.error('❌ Supabase verification error:', error, errorDescription);
          
          if (errorDescription?.includes('expired')) {
            setState({
              status: 'expired',
              message: 'Verification link expired',
              details: 'This verification link has expired. Please sign up again to receive a new verification email.'
            });
          } else {
            setState({
              status: 'error',
              message: 'Verification failed',
              details: errorDescription || 'An unknown error occurred during verification.'
            });
          }
          return;
        }

        // Validate Supabase client
        if (!supabase?.auth) {
          throw new Error('Authentication service is not available');
        }

        // Handle PKCE flow (modern, secure method)
        if (code) {
          console.log('🔐 Processing PKCE verification with code');
          
          const { data, error: pkceError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (pkceError) {
            console.error('❌ PKCE verification failed:', pkceError);
            
            if (pkceError.message.includes('code verifier')) {
              setState({
                status: 'error',
                message: 'Browser session mismatch',
                details: 'Please open the verification link in the same browser where you signed up. If this continues, try signing up again.'
              });
            } else if (pkceError.message.includes('expired')) {
              setState({
                status: 'expired',
                message: 'Verification link expired',
                details: 'This verification link has expired. Please sign up again to receive a new verification email.'
              });
            } else {
              setState({
                status: 'error',
                message: 'Verification failed',
                details: pkceError.message
              });
            }
            return;
          }

          if (data?.user) {
            console.log('✅ PKCE verification successful for user:', data.user.email);
            setState({
              status: 'success',
              message: 'Email verified successfully!',
              details: 'Your account has been verified. Redirecting to your dashboard...'
            });
            
            // Redirect after success
            setTimeout(() => {
              router.push('/home');
            }, 2000);
            return;
          }
        }

        // Handle legacy token_hash flow (fallback)
        if (tokenHash && type) {
          console.log('🔑 Processing legacy token verification');
          
          const { data, error: tokenError } = await supabase.auth.verifyOtp({
            type: type as any,
            token_hash: tokenHash,
          });
          
          if (tokenError) {
            console.error('❌ Token verification failed:', tokenError);
            setState({
              status: 'error',
              message: 'Verification failed',
              details: tokenError.message
            });
            return;
          }

          if (data?.user) {
            console.log('✅ Token verification successful for user:', data.user.email);
            setState({
              status: 'success',
              message: 'Email verified successfully!',
              details: 'Your account has been verified. Redirecting to your dashboard...'
            });
            
            setTimeout(() => {
              router.push('/home');
            }, 2000);
            return;
          }
        }

        // No valid verification method found
        console.warn('⚠️ No valid verification parameters found');
        setState({
          status: 'error',
          message: 'Invalid verification link',
          details: 'This verification link appears to be malformed or incomplete. Please try signing up again.'
        });

      } catch (error: any) {
        console.error('💥 Unexpected verification error:', error);
        setState({
          status: 'error',
          message: 'Verification failed',
          details: error.message || 'An unexpected error occurred during verification.'
        });
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  const renderContent = () => {
    switch (state.status) {
      case 'loading':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <CardTitle className="text-2xl">Verifying Email</CardTitle>
              <CardDescription>
                Please wait while we verify your email address...
              </CardDescription>
            </CardHeader>
          </Card>
        );

      case 'success':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">{state.message}</CardTitle>
              <CardDescription className="text-green-600">
                {state.details}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary">
                <Link href="/home">
                  Continue to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        );

      case 'expired':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl text-orange-800">{state.message}</CardTitle>
              <CardDescription className="text-orange-600">
                {state.details}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary">
                <Link href="/signup">
                  <Mail className="w-4 h-4 mr-2" />
                  Sign Up Again
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">
                  Already verified? Sign In
                </Link>
              </Button>
            </CardContent>
          </Card>
        );

      case 'error':
      default:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-800">{state.message}</CardTitle>
              <CardDescription className="text-red-600">
                {state.details}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary">
                <Link href="/signup">
                  <Mail className="w-4 h-4 mr-2" />
                  Try Signing Up Again
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">
                  Already verified? Sign In
                </Link>
              </Button>
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading verification...</p>
        </div>
      </div>
    }>
      <VerificationContent />
    </Suspense>
  );
}
