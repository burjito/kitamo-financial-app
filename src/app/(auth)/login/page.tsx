"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase-client";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsLoading(false);

    if (error) {
      // Enhanced error handling with specific messages
      let errorTitle = "Login Failed";
      let errorMessage = "Something went wrong. Please try again.";
      
      console.error("Login error:", error); // For debugging
      
      switch (error.message) {
        case "Invalid login credentials":
          errorTitle = "Invalid Credentials";
          errorMessage = "The email or password you entered is incorrect. Please check and try again.";
          break;
        case "Email not confirmed":
          errorTitle = "Email Not Verified";
          errorMessage = "Please verify your email with the 6-digit code that was sent to your email address during signup.";
          break;
        case "Too many requests":
          errorTitle = "Too Many Attempts";
          errorMessage = "Too many login attempts. Please wait a few minutes and try again.";
          break;
        case "User not found":
          errorTitle = "Account Not Found";
          errorMessage = "No account found with this email address. Please check your email or sign up.";
          break;
        case "Account is disabled":
          errorTitle = "Account Disabled";
          errorMessage = "Your account has been disabled. Please contact support for assistance.";
          break;
        default:
          if (error.message.includes("rate limit")) {
            errorTitle = "Rate Limited";
            errorMessage = "Too many requests. Please wait a moment and try again.";
          } else if (error.message.includes("network")) {
            errorTitle = "Connection Error";
            errorMessage = "Please check your internet connection and try again.";
          } else {
            errorMessage = error.message;
          }
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      console.log("Login success:", data); // For debugging
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in to KitaMo.",
      });
      router.push("/home");
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first, then click 'Forgot password?'",
        variant: "destructive"
      });
      return;
    }

    setIsResettingPassword(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsResettingPassword(false);

    if (error) {
      console.error("Password reset error:", error);
      
      let errorMessage = "Failed to send reset email. Please try again.";
      if (error.message.includes("rate limit")) {
        errorMessage = "Too many reset requests. Please wait a moment and try again.";
      } else if (error.message.includes("not found")) {
        errorMessage = "No account found with this email address.";
      }

      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions. Don't forget to check your spam folder.",
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2">
                <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
                <defs>
                    <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" />
                    </linearGradient>
                </defs>
                <path d="M2 32 C2 32 10 12 32 12 C54 12 62 32 62 32 C62 32 54 52 32 52 C10 52 2 32 2 32 Z" stroke="url(#eyeGradient)" strokeWidth="4" fill="none"/>
                <circle cx="32" cy="32" r="8" stroke="url(#eyeGradient)" strokeWidth="2" fill="url(#eyeGradient)"/>
                </svg>
                <h1 className="text-3xl font-bold bg-gradient-to-br from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">KitaMo</h1>
            </div>
            <p className="text-muted-foreground mt-1">Your Financial Flight Simulator</p>
          </div>
      </div>

      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue your financial journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading || isResettingPassword}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading || isResettingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isResettingPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="link"
                className="text-sm text-primary hover:underline p-0 h-auto"
                onClick={handleForgotPassword}
                disabled={isLoading || isResettingPassword}
              >
                {isResettingPassword ? "Sending..." : "Forgot password?"}
              </Button>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isResettingPassword}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <Separator />

          <div className="space-y-3 text-center">
            <div className="text-sm">
                Don't have an account?{" "}
                <Link href="/signup" passHref className="text-primary hover:underline font-medium">
                Sign up
                </Link>
            </div>

            <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-transparent">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;