
"use client";

import { useState } from "react";
import { Plus, Settings, Shield, Clock, BadgeCheck, Target, TrendingUp, PiggyBank, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/contexts/app-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { GoalDialog } from "./goal-dialog";
import { AddFundsDialog } from "./add-funds-dialog";
import { Goal } from "@/contexts/app-context";
import { cn } from "@/lib/utils";

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
    return "bg-transparent text-muted-foreground border border-border";
}

const FinancialSummary = () => {
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
          <span className="font-bold text-lg">₱15,000</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Goals Funded Monthly</span>
          <span className="font-bold text-lg">₱10,000</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Surplus/Shortfall</span>
          <span className="font-bold text-lg text-green-600">+₱5,000</span>
        </div>
        <Button variant="outline" className="w-full">
          View Full Report
        </Button>
      </CardContent>
    </Card>
  )
}

const LifeTimeline = () => {
    const { goals } = useAppContext();

    const getTargetYear = (goal: Goal) => {
        const remaining = goal.target - goal.current;
        const timelineMonths = goal.monthlyTarget > 0 ? Math.ceil(remaining / goal.monthlyTarget) : 0;
        const now = new Date();
        const targetDate = new Date(now.setMonth(now.getMonth() + timelineMonths));
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
                <div className="relative pl-6 border-l-2 border-border space-y-8">
                   {sortedYears.length > 0 ? sortedYears.map(year => (
                     <div key={year} className="relative">
                        <div className="absolute -left-[35px] top-1">
                            <span className="bg-background px-2 font-semibold text-primary">{year}</span>
                        </div>
                        <div className="space-y-4 pt-2">
                             {goalsByYear[year].map(goal => (
                                 <div key={goal.id} className="relative">
                                    <div className="absolute -left-[30px] top-[7px] h-3 w-3 rounded-full bg-primary border-2 border-background"></div>
                                    <p className="font-semibold">{goal.title}</p>
                                    <p className="text-sm text-muted-foreground">Target: ₱{goal.target.toLocaleString()}</p>
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
  const { goals, isLoading, addGoal, updateGoal, addFundsToGoal } = useAppContext();
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>(undefined);

  const handleOpenDialog = (goal?: Goal) => {
    setSelectedGoal(goal);
    setIsGoalDialogOpen(true);
  };
  
  const handleOpenAddFundsDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsAddFundsDialogOpen(true);
  }

  const handleSaveGoal = (goalData: Omit<Goal, 'id' | 'status' | 'current' | 'priority'>) => {
    if (selectedGoal?.id) {
        const existingGoal = goals.find(g => g.id === selectedGoal.id);
        if (existingGoal) {
            updateGoal({
                ...existingGoal,
                title: goalData.title,
                target: goalData.target,
                monthlyTarget: goalData.monthlyTarget,
            });
        }
    } else {
      addGoal({
        ...goalData,
        id: Date.now().toString(),
        current: 0,
        status: 'Active',
        priority: 'Medium',
      });
    }
  };

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
      <div className="animate-in fade-in-0 duration-500 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-primary/10 p-2 rounded-full">
                <Target className="h-6 w-6 text-primary" />
             </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Your Financial Goals
              </h1>
              <p className="text-muted-foreground max-w-2xl text-sm">
                Track progress toward your financial milestones and stay motivated.
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Button variant="outline">View Full Report</Button>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
                 {isLoading ? (
                    [...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                        <Skeleton className="h-32 w-full" />
                        </CardContent>
                    </Card>
                    ))
                ) : goals.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold text-muted-foreground">No goals yet!</h2>
                    <p className="text-muted-foreground mt-2">Click "Add Goal" to start your financial journey.</p>
                    </div>
                ) : (
                    goals.map((goal) => {
                        const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                        const remaining = goal.target - goal.current;
                        const timeline = goal.monthlyTarget > 0 ? Math.ceil(remaining / goal.monthlyTarget) : 0;

                        return (
                            <Card key={goal.id}>
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-red-50 p-3 rounded-full border border-red-100">
                                                <Shield className="h-6 w-6 text-red-600" />
                                            </div>
                                            <div>
                                                <h2 className="font-bold text-lg text-foreground">{goal.title}</h2>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className={cn("capitalize", getPriorityStyles(goal.priority))}>
                                                        {goal.priority} priority
                                                    </Badge>
                                                    <Badge className={cn(getStatusStyles(goal.status))}>
                                                        <BadgeCheck className="mr-1 h-3 w-3" />
                                                        {goal.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(goal)}>
                                            <Settings className="h-5 w-5 text-muted-foreground" />
                                        </Button>
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
                                        Monthly target: <span className="font-bold text-foreground">₱{goal.monthlyTarget.toLocaleString()}</span>
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
                <FinancialSummary />
                <LifeTimeline />
            </div>
        </div>
      </div>
    </>
  );
}

    