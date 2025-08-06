
"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Lightbulb, PiggyBank, Target, BrainCircuit, Rocket, Shield, ShieldQuestion } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/contexts/app-context";
import { FinancialSetupModal } from "./financial-setup-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const { profile, goals, isLoading: isAppLoading, monthlyIncome, monthlyExpenses } = useAppContext();
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const router = useRouter();
  
  // Effect to check if the setup modal should be shown
  useEffect(() => {
    if (!isAppLoading && profile && profile.monthly_income === null) {
      setIsSetupModalOpen(true);
    }
  }, [profile, isAppLoading]);
  
  const welcomeName = profile?.first_name || "there";
  
  const renderLockedDashboard = () => (
    <div className="space-y-8">
       <Card className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground text-center shadow-xl">
          <CardHeader>
            <div className="flex justify-center items-center pb-2">
              <div className="bg-primary-foreground/20 p-3 rounded-full">
                <ShieldQuestion className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl">One Last Step, {welcomeName}!</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
                Complete your risk assessment to unlock your personalized dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">This helps us tailor financial insights just for you.</p>

            <Button asChild size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 animate-pulse">
                <Link href="/risk-profile-assessment">
                    <Rocket className="mr-2 h-5 w-5" />
                    Take Your Risk Assessment
                </Link>
            </Button>
          </CardContent>
       </Card>
    </div>
  );

  const renderExistingUserDashboard = () => {
    const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
    const monthlySavings = (monthlyIncome || 0) - (monthlyExpenses || 0);

    return (
        <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₱{totalCurrent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">Across all your goals</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                Monthly Surplus
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+₱{monthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">
                Available to fund your goals
                </p>
            </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Risk Profile</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Badge variant={profile?.risk_profile === "Aggressive" ? "destructive" : "secondary"}>{profile?.risk_profile || 'N/A'}</Badge>
                    <p className="text-xs text-muted-foreground mt-2">Based on your assessment</p>
                </CardContent>
            </Card>
            <Card className="bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                Explore Possibilities
                </CardTitle>
                <Lightbulb className="h-4 w-4 text-primary-foreground/80" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-primary-foreground/90 mb-4">
                What if you saved for a new car? Or a trip abroad?
                </p>
                <Button asChild variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    <Link href="/what-if-simulator">
                        Run a Simulation
                        <ArrowUpRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardContent>
            </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Active Goals</CardTitle>
                <CardDescription>
                Your next milestones are just around the corner.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {goals.slice(0, 2).map(goal => (
                     <div className="space-y-2" key={goal.id}>
                        <div className="flex justify-between items-center">
                            <p className="font-medium">{goal.title}</p>
                            <p className="text-sm text-muted-foreground">₱{goal.current.toLocaleString()} / ₱{goal.target.toLocaleString()}</p>
                        </div>
                        <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                    </div>
                ))}
                 {goals.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-semibold text-muted-foreground">No Goals Yet!</h3>
                    <p className="text-sm text-muted-foreground mt-1">Start by adding a financial goal.</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/goal-tracker">Go to Goal Tracker</Link>
                    </Button>
                  </div>
                )}
                {goals.length > 0 &&
                <Button asChild variant="outline" className="w-full">
                    <Link href="/goal-tracker">
                        View All Goals
                    </Link>
                </Button>
                }
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Personalized Insights</CardTitle>
                <CardDescription>
                AI-powered suggestions based on your {profile?.risk_profile} profile.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg bg-secondary/10">
                    <BrainCircuit className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <div>
                        <p className="font-medium">Optimize Your Savings</p>
                        <p className="text-sm text-muted-foreground">Consider moving ₱5,000 to a high-yield savings account to reach your Japan trip goal 2 months faster.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-lg bg-secondary/10">
                    <BrainCircuit className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <div>
                        <p className="font-medium">Subscription Review</p>
                        <p className="text-sm text-muted-foreground">We noticed 3 subscriptions you rarely use, totaling ₱899/month. Reviewing them could boost your savings.</p>
                    </div>
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    );
  }

  const shouldShowLockedDashboard = !isAppLoading && profile && !profile.risk_profile;
  
  return (
    <>
    <FinancialSetupModal 
      isOpen={isSetupModalOpen}
      onClose={() => setIsSetupModalOpen(false)}
    />
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {welcomeName}!
        </h1>
        <p className="text-muted-foreground">
          {shouldShowLockedDashboard
            ? "Let's complete your profile to unlock your financial dashboard."
            : "Here's your financial snapshot. Let's make today count."}
        </p>
      </div>
      
      {isAppLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : shouldShowLockedDashboard ? (
        renderLockedDashboard()
      ) : (
        renderExistingUserDashboard()
      )}

    </div>
    </>
  );
}
