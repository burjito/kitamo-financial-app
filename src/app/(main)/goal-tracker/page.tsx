
"use client";

import { useState } from "react";
import { Plus, Settings, Shield, Clock, BadgeCheck, Target, TrendingUp, PiggyBank, Calendar, Lightbulb } from "lucide-react";
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
import { Label } from "@/components/ui/label";

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

const FinancialSummary = () => {
    const { goals } = useAppContext();
    const totalMonthlyTarget = goals.reduce((sum, goal) => sum + goal.monthlyTarget, 0);
    const monthlyIncome = 50000; 
    const surplus = monthlyIncome - totalMonthlyTarget;

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
        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10">
            <Lightbulb className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
            <div>
                <p className="font-medium text-sm text-primary">AI Insight</p>
                <p className="text-sm text-muted-foreground">Your surplus is healthy. Consider allocating an extra ₱{Math.floor(surplus*0.5).toLocaleString()} to your 'High' priority goals to reach them faster.</p>
            </div>
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
        const remaining = goal.target > goal.current ? goal.target - goal.current : 0;
        if (goal.monthlyTarget <= 0) {
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

const FilterButton = ({ label, value, currentFilter, setFilter }: { label: string, value: string, currentFilter: string, setFilter: (value: string) => void }) => (
    <Button
        variant={currentFilter === value ? "default" : "outline"}
        size="sm"
        onClick={() => setFilter(value)}
        className="capitalize"
    >
        {label}
    </Button>
)

export default function GoalTrackerPage() {
  const { goals, isLoading, addGoal, updateGoal, addFundsToGoal } = useAppContext();
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const handleOpenDialog = (goal?: Goal) => {
    setSelectedGoal(goal);
    setIsGoalDialogOpen(true);
  };
  
  const handleOpenAddFundsDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsAddFundsDialogOpen(true);
  }

  const handleSaveGoal = (goalData: Goal) => {
    if (selectedGoal?.id) {
       updateGoal(goalData);
    } else {
      addGoal({
        ...goalData,
        id: Date.now().toString(),
        current: 0,
        status: 'Active',
      });
    }
  };

  const filteredGoals = goals.filter(goal => {
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
            <Button variant="outline">Export Report</Button>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <Label className="font-semibold text-sm">Status</Label>
                            <div className="flex gap-2">
                                <FilterButton label="All" value="all" currentFilter={statusFilter} setFilter={setStatusFilter} />
                                <FilterButton label="Active" value="active" currentFilter={statusFilter} setFilter={setStatusFilter} />
                                <FilterButton label="Paused" value="paused" currentFilter={statusFilter} setFilter={setStatusFilter} />
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label className="font-semibold text-sm">Priority</Label>
                            <div className="flex gap-2">
                                <FilterButton label="All" value="all" currentFilter={priorityFilter} setFilter={setPriorityFilter} />
                                <FilterButton label="High" value="high" currentFilter={priorityFilter} setFilter={setPriorityFilter} />
                                <FilterButton label="Medium" value="medium" currentFilter={priorityFilter} setFilter={setPriorityFilter} />
                                <FilterButton label="Low" value="low" currentFilter={priorityFilter} setFilter={setPriorityFilter} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 {isLoading ? (
                    [...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                        <Skeleton className="h-32 w-full" />
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
                                                    <Badge className={cn("capitalize", getStatusStyles(goal.status))}>
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
