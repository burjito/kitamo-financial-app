"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase-client";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.password.length < 6) {
        toast({
            title: "Weak Password",
            description: "Password should be at least 6 characters long.",
            variant: "destructive"
        });
        return;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Get the base URL for email redirect
    const getBaseUrl = () => {
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
      }
      if (typeof window !== 'undefined') {
        return window.location.origin;
      }
      return 'http://localhost:3000'; // fallback for build time
    };

    try {
      // Check if supabase is available
      if (!supabase || !supabase.auth) {
        throw new Error('Authentication service is not available');
      }

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
          // Remove emailRedirectTo to use OTP instead of email links
          // Supabase will send a 6-digit OTP to the email
        },
      });

      if (error) throw error;

      setIsLoading(false);

      toast({
        title: "Welcome to KitaMo!",
        description: "Account created successfully! We've sent a 6-digit verification code to your email. Please check your email and enter the code on the next page.",
        duration: 8000,
      });
       
      // Redirect to OTP verification page
      router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Signup Failed",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive"
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
            <p className="text-muted-foreground mt-1">Start Your Financial Journey</p>
          </div>
      </div>

      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Join thousands making smarter financial decisions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Juan"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Dela Cruz"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10"
                  required
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
                  placeholder="6+ characters required"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange("agreeToTerms", !!checked)}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="/terms" passHref className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" passHref className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <Separator />

           <div className="space-y-3 text-center">
            <div className="text-sm">
                Already have an account?{" "}
                <Link href="/login" passHref className="text-primary hover:underline font-medium">
                Sign in
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

export default Signup;