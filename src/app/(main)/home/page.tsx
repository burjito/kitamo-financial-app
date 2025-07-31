import { ArrowUpRight, Lightbulb, PiggyBank, Target } from "lucide-react";
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

export default function HomePage() {
  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, Alex!
        </h1>
        <p className="text-muted-foreground">
          Here's your financial snapshot. Let's make today count.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱125,430.50</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              This Month's Savings
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+₱12,234.89</div>
            <p className="text-xs text-muted-foreground">
              You're on track to meet your monthly goal!
            </p>
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
            <CardTitle>Upcoming Goals</CardTitle>
            <CardDescription>
              Your next milestones are just around the corner.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-medium">Macbook Pro 14"</p>
                <p className="text-sm text-muted-foreground">₱88,000 / ₱150,000</p>
              </div>
              <Progress value={58} className="h-2" />
              <p className="text-xs text-muted-foreground">58% complete - est. 5 months left</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-medium">Japan Trip 2025</p>
                <p className="text-sm text-muted-foreground">₱35,000 / ₱100,000</p>
              </div>
              <Progress value={35} className="h-2" />
               <p className="text-xs text-muted-foreground">35% complete - est. 8 months left</p>
            </div>
             <Button asChild variant="outline" className="w-full">
                <Link href="/goal-tracker">
                    View All Goals
                </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Personalized Insights</CardTitle>
            <CardDescription>
              AI-powered suggestions to help you get ahead.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
                <Lightbulb className="h-5 w-5 mt-1 text-accent-foreground flex-shrink-0" />
                <div>
                    <p className="font-medium">Optimize Your Savings</p>
                    <p className="text-sm text-muted-foreground">Consider moving ₱5,000 to a high-yield savings account to reach your Japan trip goal 2 months faster.</p>
                </div>
            </div>
             <div className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
                <Lightbulb className="h-5 w-5 mt-1 text-accent-foreground flex-shrink-0" />
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
