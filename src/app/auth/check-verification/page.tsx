"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Clock, CheckCircle } from "lucide-react";
import supabase from "@/lib/supabase-client";

export default function CheckVerificationPage() {
  const [verificationStatus, setVerificationStatus] = useState<'checking' | 'verified' | 'pending'>('checking');

  useEffect(() => {
    const checkVerification = async () => {
      if (!supabase) {
        setVerificationStatus('pending');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email_confirmed_at) {
        setVerificationStatus('verified');
      } else {
        setVerificationStatus('pending');
      }
    };

    checkVerification();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {verificationStatus === 'checking' && <Clock className="w-8 h-8 text-blue-600 animate-spin" />}
            {verificationStatus === 'verified' && <CheckCircle className="w-8 h-8 text-green-600" />}
            {verificationStatus === 'pending' && <Mail className="w-8 h-8 text-yellow-600" />}
          </div>
          
          {verificationStatus === 'checking' && (
            <>
              <CardTitle className="text-2xl text-blue-600">Checking Status...</CardTitle>
              <CardDescription>Please wait while we check your verification status.</CardDescription>
            </>
          )}
          
          {verificationStatus === 'verified' && (
            <>
              <CardTitle className="text-2xl text-green-600">Account Verified!</CardTitle>
              <CardDescription>Your email has been successfully verified. You can now access all features.</CardDescription>
            </>
          )}
          
          {verificationStatus === 'pending' && (
            <>
              <CardTitle className="text-2xl text-yellow-600">Verification Pending</CardTitle>
              <CardDescription>Please check your email and click the verification link to complete your account setup.</CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {verificationStatus === 'verified' && (
            <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary">
              <Link href="/home">
                Continue to Dashboard
              </Link>
            </Button>
          )}
          
          {verificationStatus === 'pending' && (
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/signup">
                  Resend Verification Email
                </Link>
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
                variant="secondary"
              >
                Check Again
              </Button>
            </div>
          )}
          
          <div className="text-center">
            <Link 
              href="/login" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
