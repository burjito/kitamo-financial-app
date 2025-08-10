"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, RefreshCw, ArrowLeft, Timer } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase-client";

function OTPVerificationContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = searchParams.get('email') || '';

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto-focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'Paste' || (e.ctrlKey && e.key === 'v')) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('');
        if (digits.length === 6) {
          setOtp(digits);
          handleVerifyOtp(digits.join(''));
        }
      });
    }
  };

  const handleVerifyOtp = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (!supabase?.auth) {
        throw new Error('Authentication service is not available');
      }

      console.log('🔐 Verifying OTP for email:', email);

      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otpCode,
        type: 'signup'
      });

      if (error) {
        console.error('❌ OTP verification failed:', error);
        
        if (error.message.includes('expired')) {
          toast({
            title: "Code Expired",
            description: "This verification code has expired. Please request a new one.",
            variant: "destructive"
          });
        } else if (error.message.includes('invalid')) {
          toast({
            title: "Invalid Code",
            description: "The verification code is incorrect. Please check your email and try again.",
            variant: "destructive"
          });
          // Clear the OTP inputs
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        } else {
          toast({
            title: "Verification Failed",
            description: error.message || "An error occurred during verification.",
            variant: "destructive"
          });
        }
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        console.log('✅ OTP verification successful for user:', data.user.email);
        setIsVerified(true);
        
        toast({
          title: "Email Verified!",
          description: "Your account has been successfully verified. Please log in to continue.",
        });

        // Sign out the user after verification so they must manually log in
        await supabase.auth.signOut();
        
        // Redirect to login page
        router.push('/login');
      }

    } catch (error: any) {
      console.error('💥 Unexpected OTP verification error:', error);
      toast({
        title: "Verification Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "No email address found. Please go back and sign up again.",
        variant: "destructive"
      });
      return;
    }

    setIsResending(true);

    try {
      if (!supabase?.auth) {
        throw new Error('Authentication service is not available');
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        toast({
          title: "Resend Failed",
          description: error.message || "Failed to resend verification code.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Code Sent",
          description: "A new verification code has been sent to your email.",
        });
        setTimeLeft(300); // Reset timer
        setOtp(["", "", "", "", "", ""]); // Clear inputs
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Email Verified!</CardTitle>
            <CardDescription className="text-green-600">
              Your account has been successfully verified. Redirecting to login...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary">
              <Link href="/login">
                Continue to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit code to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-center block">Enter verification code</Label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={() => handleVerifyOtp(otp.join(''))}
            disabled={isLoading || otp.some(digit => !digit)}
            className="w-full bg-gradient-to-r from-primary to-secondary"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>

          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span>Code expires in {formatTime(timeLeft)}</span>
            </div>

            {timeLeft > 0 ? (
              <Button
                variant="outline"
                onClick={handleResendCode}
                disabled={isResending}
                className="w-full"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? "Sending..." : "Resend Code"}
              </Button>
            ) : (
              <Button
                onClick={handleResendCode}
                disabled={isResending}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? "Sending..." : "Send New Code"}
              </Button>
            )}

            <div className="text-center">
              <Link 
                href="/signup" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign Up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading verification page...</p>
        </div>
      </div>
    }>
      <OTPVerificationContent />
    </Suspense>
  );
}
