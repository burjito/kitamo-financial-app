
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Settings, Shield, Clock, BadgeCheck, Target, PiggyBank, Calendar, Lightbulb, Filter, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/contexts/app-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { GoalDialog } from "./goal-dialog";
import { AddFundsDialog } from "./add-funds-dialog";
import { Goal, Scenario } from "@/contexts/app-context";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { generateGoalInsights, GenerateGoalInsightsOutput } from "@/ai/flows/generate-goal-insights";
import { useToast } from "@/hooks/use-toast";


const getPriorityStyles = (priority: string) => {
    switch (priority.toLowerCase()) {
        case "high":
            return "bg-red-100 text-red-800 border border-red-200";
        case "medium":
            return "bg-yellow-100 text-yellow-800 border border-yellow-200";
        case "low":
            return "bg-blue-100 text-blue-800 border border-blue-200";
        default:
            return "bg-muted text-muted-foreground";
    }
};

const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
        case "active":
             return "bg-green-100 text-green-800 border border-green-200";
        case "paused":
            return "bg-gray-100 text-gray-800 border border-gray-200";
        default:
            return "bg-muted text-muted-foreground";
    }
}

const FinancialSummary = ({ insight, feasibilityScore, isLoadingInsight }: { insight: string; feasibilityScore: number; isLoadingInsight: boolean }) => {
    const { goals, monthlyIncome } = useAppContext();
    const totalMonthlyTarget = goals.reduce((sum, goal) => sum + (goal.monthlyTarget || 0), 0);
    const surplus = monthlyIncome - totalMonthlyTarget;

    const getFeasibilityStyles = (score: number) => {
      if (score >= 75) return "text-green-600 bg-green-500/10";
      if (score >= 50) return "text-yellow-600 bg-yellow-500/10";
      return "text-red-600 bg-red-500/10";
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <PiggyBank className="h-5 w-5 text-primary" />
          Financial Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Monthly Savings</span>
          <span className="font-bold text-lg">₱{monthlyIncome.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Goals Funded Monthly</span>
          <span className="font-bold text-lg">₱{totalMonthlyTarget.toLocaleString()}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Surplus/Shortfall</span>
          <span className={cn("font-bold text-lg", surplus >= 0 ? "text-green-600" : "text-red-600")}>
            {surplus >= 0 ? `+₱${surplus.toLocaleString()}` : `-₱${Math.abs(surplus).toLocaleString()}`}
          </span>
        </div>
        
        <div className={cn("flex justify-between items-center p-3 rounded-lg", isLoadingInsight ? "" : getFeasibilityStyles(feasibilityScore))}>
            <span className="font-semibold text-sm">Feasibility Score</span>
            {isLoadingInsight ? (
              <Skeleton className="h-5 w-10" />
            ) : (
              <span className="font-bold text-lg">{feasibilityScore}/100</span>
            )}
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10">
            <Lightbulb className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
            <div>
                <p className="font-medium text-sm text-primary">AI Insight</p>
                {isLoadingInsight ? (
                  <div className="space-y-2 mt-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{insight}</p>
                )}
            </div>
        </div>
        <Button asChild variant="outline" className="w-full">
            <Link href="/financial-report">View Full Report</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

const LifeTimeline = () => {
    const { goals } = useAppContext();

    const getTargetYear = (goal: Goal) => {
        const remaining = goal.target > goal.current ? goal.target - goal.current : 0;
        if (!goal.monthlyTarget || goal.monthlyTarget <= 0) {
            return new Date().getFullYear();
        }
        const timelineMonths = Math.ceil(remaining / goal.monthlyTarget);
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + timelineMonths);
        return targetDate.getFullYear();
    };
    
    const goalsByYear = goals.reduce((acc, goal) => {
        const year = getTargetYear(goal);
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(goal);
        return acc;
    }, {} as Record<number, Goal[]>);

    const sortedYears = Object.keys(goalsByYear).map(Number).sort((a, b) => a - b);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    Your Life Timeline
                </CardTitle>
                 <CardDescription>
                    A visual overview of your financial journey.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                   {sortedYears.length > 0 ? sortedYears.map(year => (
                     <div key={year} className="relative flex">
                        <div className="flex flex-col items-center mr-4">
                            <div className="bg-background pr-2 font-semibold text-primary">{year}</div>
                        </div>
                        <div className="border-l-2 border-border pl-4 flex-1 space-y-4">
                            {goalsByYear[year].map((goal, index) => (
                                 <div key={goal.id} className="relative">
                                    <div className="absolute -left-[2.1rem] top-1 h-3 w-3 rounded-full bg-primary border-2 border-background"></div>
                                    <div className="ml-2">
                                        <p className="font-semibold">{goal.title}</p>
                                        <p className="text-sm text-muted-foreground">Target: ₱{goal.target.toLocaleString()}</p>
                                    </div>
                                </div>
                             ))}
                        </div>
                     </div>
                   )) : (
                     <p className="text-muted-foreground text-sm">Add goals to see your timeline.</p>
                   )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function GoalTrackerPage() {
  const { goals, isLoading, addGoal, updateGoal, deleteGoal, addFundsToGoal, monthlyIncome } = useAppContext();
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { toast } = useToast();

  const [aiInsight, setAiInsight] = useState<GenerateGoalInsightsOutput>({ insight: "", feasibilityScore: 0 });
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      if (!isLoading && goals.length > 0) {
        setIsLoadingInsight(true);
        try {
          const result = await generateGoalInsights({
            monthlyIncome,
            goals,
          });
          setAiInsight(result);
        } catch (error) {
          console.error("Failed to fetch AI insight:", error);
          setAiInsight({ insight: "Could not load insights at this time.", feasibilityScore: 0 });
        } finally {
          setIsLoadingInsight(false);
        }
      } else if (goals.length === 0) {
         setAiInsight({ insight: "You haven't added any goals yet. Add one to get started!", feasibilityScore: 0 });
         setIsLoadingInsight(false);
      }
    };
    fetchInsight();
  }, [isLoading, goals, monthlyIncome]);


  const handleOpenDialog = (goal?: Goal) => {
    setSelectedGoal(goal);
    setIsGoalDialogOpen(true);
  };
  
  const handleOpenAddFundsDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsAddFundsDialogOpen(true);
  }

  const handleSaveGoal = async (goalData: Omit<Goal, 'id' | 'current' | 'status'> | Goal) => {
    try {
        if ('id' in goalData && goalData.id) {
           await updateGoal(goalData as Goal);
            toast({ title: "Goal Updated!", description: `"${goalData.title}" has been successfully updated.` });
        } else {
            await addGoal(goalData as Omit<Goal, 'id' | 'current' | 'status'>);
            toast({ title: "Goal Created!", description: `"${goalData.title}" has been added to your goals.` });
        }
    } catch(e) {
        toast({ title: "Error", description: "Could not save the goal. Please try again.", variant: "destructive" });
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
        await deleteGoal(id);
        toast({ title: "Goal Deleted", description: "The goal has been removed." });
    } catch(e) {
        toast({ title: "Error", description: "Could not delete the goal. Please try again.", variant: "destructive" });
    }
  }

  const priorityOrder: { [key in Goal['priority']]: number } = {
    'High': 1,
    'Medium': 2,
    'Low': 3,
  };

  const filteredGoals = goals
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .filter(goal => {
        const statusMatch = statusFilter === 'all' || goal.status.toLowerCase() === statusFilter;
        const priorityMatch = priorityFilter === 'all' || goal.priority.toLowerCase() === priorityFilter;
        return statusMatch && priorityMatch;
    });

  return (
    <>
      <GoalDialog 
        open={isGoalDialogOpen}
        onOpenChange={setIsGoalDialogOpen}
        onSave={handleSaveGoal}
        goal={selectedGoal}
      />
      {selectedGoal && (
        <AddFundsDialog
            open={isAddFundsDialogOpen}
            onOpenChange={setIsAddFundsDialogOpen}
            goal={selectedGoal}
            onAddFunds={(amount) => addFundsToGoal(selectedGoal.id!, amount)}
        />
      )}
      <div className="animate-in fade-in-0 duration-500">
        <Card>
            <CardHeader className="flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                     <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Target className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                        Financial Goals
                    </CardTitle>
                    <CardDescription className="text-sm">
                        Track progress toward your milestones.
                    </CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog()} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Goal
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 items-start">
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                        <Card>
                            <CardHeader>
                               <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                                  <Filter className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                   Filter Goals
                               </CardTitle>
                                <CardDescription>
                                    Narrow down your goals to focus on what matters most.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col md:flex-row gap-4">
                               <div className="flex-1 space-y-2">
                                   <Label className="font-semibold text-sm">Status</Label>
                                   <Select value={statusFilter} onValueChange={setStatusFilter}>
                                     <SelectTrigger>
                                       <SelectValue placeholder="Filter by status" />
                                     </SelectTrigger>
                                     <SelectContent>
                                       <SelectItem value="all">All Statuses</SelectItem>
                                       <SelectItem value="active">Active</SelectItem>
                                       <SelectItem value="paused">Paused</SelectItem>
                                     </SelectContent>
                                   </Select>
                               </div>
                               <div className="flex-1 space-y-2">
                                   <Label className="font-semibold text-sm">Priority</Label>
                                   <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                     <SelectTrigger>
                                       <SelectValue placeholder="Filter by priority" />
                                     </SelectTrigger>
                                     <SelectContent>
                                       <SelectItem value="all">All Priorities</SelectItem>
                                       <SelectItem value="high">High</SelectItem>
                                       <SelectItem value="medium">Medium</SelectItem>
                                       <SelectItem value="low">Low</SelectItem>
                                     </SelectContent>
                                   </Select>
                               </div>
                            </CardContent>
                        </Card>

                         {isLoading ? (
                            [...Array(2)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader><Skeleton className="h-5 w-2/5" /></CardHeader>
                                <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                                </CardContent>
                            </Card>
                            ))
                        ) : filteredGoals.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed rounded-lg">
                            <h2 className="text-xl font-semibold text-muted-foreground">No matching goals found!</h2>
                            <p className="text-muted-foreground mt-2">Try adjusting your filters or adding a new goal.</p>
                            </div>
                        ) : (
                            filteredGoals.map((goal) => {
                                const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                                const remaining = goal.target - goal.current;
                                const timeline = (goal.monthlyTarget || 0) > 0 ? Math.ceil(remaining / (goal.monthlyTarget || 1)) : 0;

                                return (
                                    <Card key={goal.id}>
                                        <CardContent className="p-6 space-y-6">
                                            <div className="flex justify-between items-center">
                                                <h2 className="font-bold text-lg text-foreground flex-1">{goal.title}</h2>
                                                <div className="flex items-center">
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(goal)}>
                                                        <Settings className="h-5 w-5 text-muted-foreground" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <Trash2 className="h-5 w-5 text-destructive/70" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete your
                                                                goal "{goal.title}".
                                                            </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteGoal(goal.id!)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge className={cn("capitalize", getPriorityStyles(goal.priority))}>
                                                    {goal.priority} priority
                                                </Badge>
                                                <Badge className={cn("capitalize", getStatusStyles(goal.status))}>
                                                    <BadgeCheck className="mr-1 h-3 w-3" />
                                                    {goal.status}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <p className="font-medium text-sm">Progress</p>
                                                    <p className="font-medium text-sm text-foreground">{progress.toFixed(0)}%</p>
                                                </div>
                                                <Progress value={progress} className="h-3 bg-secondary/20" />
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div className="space-y-1">
                                                    <p className="text-muted-foreground">Current</p>
                                                    <p className="font-bold text-base text-foreground">₱{goal.current.toLocaleString()}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-muted-foreground">Target</p>
                                                    <p className="font-bold text-base text-foreground">₱{goal.target.toLocaleString()}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-muted-foreground">Remaining</p>
                                                    <p className="font-bold text-base text-foreground">₱{remaining.toLocaleString()}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-muted-foreground">Timeline</p>
                                                    <div className="flex items-center gap-1.5 font-bold text-base text-foreground">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{timeline} months</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <Separator />
                                            
                                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                                <p className="text-sm text-muted-foreground">
                                                Monthly target: <span className="font-bold text-foreground">₱{(goal.monthlyTarget || 0).toLocaleString()}</span>
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" onClick={() => handleOpenAddFundsDialog(goal)}>Add Funds</Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        )}
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                        <FinancialSummary 
                          insight={aiInsight.insight}
                          feasibilityScore={aiInsight.feasibilityScore}
                          isLoadingInsight={isLoadingInsight}
                        />
                        <LifeTimeline />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
