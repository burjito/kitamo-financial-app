"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Mail, ArrowLeft } from "lucide-react";

function VerifyErrorContent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || 'An error occurred during email verification';
  
  // Check if this is an expired link error
  const isExpiredLink = errorMessage.toLowerCase().includes('expired') || 
                       errorMessage.toLowerCase().includes('invalid') ||
                       errorMessage.toLowerCase().includes('otp_expired');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            {isExpiredLink ? 'Verification Link Expired' : 'Verification Failed'}
          </CardTitle>
          <CardDescription>
            {isExpiredLink 
              ? 'Your verification link has expired. Please sign up again to receive a new one.'
              : 'There was an issue verifying your email address.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground bg-red-50 p-3 rounded-lg border border-red-200">
            {errorMessage}
          </div>
          
          {isExpiredLink && (
            <div className="text-center text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
              💡 <strong>Tip:</strong> Verification links expire after 24 hours for security. Sign up again to receive a fresh link.
            </div>
          )}
          
          <div className="space-y-2">
            <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary">
              <Link href="/signup">
                <Mail className="w-4 h-4 mr-2" />
                {isExpiredLink ? 'Sign Up Again' : 'Try Signing Up Again'}
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
    </div>
  );
}

export default function VerifyErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <VerifyErrorContent />
    </Suspense>
  );
}
