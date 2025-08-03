"use client";

import { useState, useEffect } from "react";
import { Plus, Download, Trash2, Edit, Target, Car, Home, Briefcase, Plane, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/contexts/app-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
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

const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track": return "bg-green-500/20 text-green-700 border-green-500/20";
      case "Nearly There": return "bg-yellow-500/20 text-yellow-700 border-yellow-500/20";
      case "Needs Attention": return "bg-red-500/20 text-red-700 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
}

const goalTypes = {
  emergency: { icon: AlertTriangle, color: "text-yellow-500", name: "Emergency Fund" },
  vacation: { icon: Plane, color: "text-blue-500", name: "Vacation" },
  car: { icon: Car, color: "text-green-500", name: "Car Purchase" },
  house: { icon: Home, color: "text-red-500", name: "House Down Payment" },
  business: { icon: Briefcase, color: "text-purple-500", name: "Business Capital" },
  default: { icon: Target, color: "text-primary", name: "Goal"}
};

const getIconForGoalType = (type: string): React.ElementType => {
    const goalInfo = (goalTypes as any)[type] || goalTypes.default;
    return goalInfo.icon;
};

export default function GoalTrackerPage() {
  const { goals, scenarios, isLoading, deleteGoal } = useAppContext();

  const handleExport = () => {
    if (goals.length === 0) return;
    const headers = "Title,Target,Current,Status,Progress (%)";
    const rows = goals.map(goal => {
      const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
      return `"${goal.title}",${goal.target},${goal.current},"${goal.status}",${progress.toFixed(2)}`;
    }).join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kitamo_goals_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const timelineEvents = scenarios
    .map(scenario => {
      const completionDate = new Date();
      completionDate.setMonth(completionDate.getMonth() + scenario.timeframe);
      return {
        year: completionDate.getFullYear(),
        title: scenario.name,
        description: `Goal: ₱${scenario.savingsGoal.toLocaleString()}`,
        icon: getIconForGoalType(scenario.goalType),
      };
    })
    .sort((a, b) => a.year - b.year);

  return (
    <div className="animate-in fade-in-0 duration-500 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Goal Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Your command center for all financial aspirations. Track, visualize, and manage your journey to success.
          </p>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" disabled={goals.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Goal
            </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Active Goals</CardTitle>
                    <CardDescription>Your current financial goals in progress.</CardDescription>
                </CardHeader>
                <CardContent>
                 {isLoading ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {[...Array(2)].map((_, i) => (
                        <Card key={i} className="bg-secondary/10">
                          <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                          <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Skeleton className="h-2 w-full" />
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-4 w-1/4" />
                                </div>
                            </div>
                             <div className="flex items-center justify-end gap-2 pt-4">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : goals.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h2 className="text-xl font-semibold text-muted-foreground">No goals yet!</h2>
                        <p className="text-muted-foreground mt-2">Create your first goal from the simulator or by clicking the button above.</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                      {goals.map((goal) => {
                          const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                          return (
                              <Card key={goal.id} className="flex flex-col bg-secondary/10">
                                  <CardHeader>
                                      <div className="flex justify-between items-start">
                                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                                          <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                                      </div>
                                  </CardHeader>
                                  <CardContent className="flex-grow flex flex-col justify-between space-y-4">
                                      <div className="space-y-2">
                                        <Progress value={progress} className="h-2" />
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-foreground">
                                              ₱{goal.current.toLocaleString()}
                                            </span>
                                            <span className="text-muted-foreground">
                                              / ₱{goal.target.toLocaleString()}
                                            </span>
                                        </div>
                                      </div>
                                       <div className="flex items-center justify-end gap-2 pt-4">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your goal "{goal.title}".
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction onClick={() => goal.id && deleteGoal(goal.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </div>
                                  </CardContent>
                              </Card>
                          )
                      })}
                    </div>
                  )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Life Timeline</CardTitle>
                    <CardDescription>A visual map of your saved scenarios and future milestones.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-8 pl-6">
                        {[...Array(3)].map((_, i) => (
                           <div key={i} className="flex gap-4">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                  ) : timelineEvents.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h2 className="text-xl font-semibold text-muted-foreground">Your LifePath is an open road!</h2>
                        <p className="text-muted-foreground mt-2">Go to the What-If Simulator to create and save a few scenarios to see your timeline appear here.</p>
                    </div>
                  ) : (
                    <div className="relative pl-6">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
                        
                        {timelineEvents.map((event, index) => (
                            <div key={index} className="relative mb-10">
                                <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-primary border-4 border-background flex items-center justify-center -translate-x-1/2">
                                     <event.icon className="h-3 w-3 text-primary-foreground" />
                                </div>
                                <div className="ml-8">
                                    <p className="text-lg font-semibold text-primary">{event.year}</p>
                                    <h3 className="font-medium text-lg text-foreground">{event.title}</h3>
                                    <p className="text-muted-foreground">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                  )}
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Your projected financial snapshot based on your current path.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Monthly Savings</span>
                    <span className="font-bold text-lg">₱18,500</span>
                  </div>
                  <Separator />
                   <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Goals Value</span>
                    <span className="font-bold text-lg">₱2,800,000</span>
                  </div>
                  <Separator />
                   <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Est. Completion Year</span>
                    <span className="font-bold text-lg">2036</span>
                  </div>
                  <Separator />
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <p className="text-sm font-medium text-secondary-foreground">Feasibility Check</p>
                    <p className="text-xs text-muted-foreground">Your plan is ambitious but achievable. Watch for tight cash flow around 2028.</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
