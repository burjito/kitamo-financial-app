"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail } from "lucide-react";

export default function VerifySuccessPage() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/login";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Email Verified!</CardTitle>
          <CardDescription>
            Your account has been successfully verified. You can now log in to KitaMo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            You will be redirected to the login page in {countdown} seconds...
          </div>
          <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary">
            <Link href="/login">
              <Mail className="w-4 h-4 mr-2" />
              Continue to Login
            </Link>
          </Button>
          <div className="text-center">
            <Link 
              href="/home" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
