"use client";

import { useState, useEffect } from "react";
import { Plus, Download, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/contexts/app-context";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function GoalTrackerPage() {
  const { goals, isLoading, deleteGoal } = useAppContext();

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

  return (
    <div className="animate-in fade-in-0 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="space-y-2 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Goal Tracker
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Your command center for all your financial aspirations. Create, track, and prioritize your goals to turn dreams into reality.
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
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
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
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold text-muted-foreground">No goals yet!</h2>
            <p className="text-muted-foreground mt-2">Create your first goal from the simulator or by clicking the button below.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
              const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
              return (
                  <Card key={goal.id} className="flex flex-col">
                      <CardHeader>
                          <div className="flex justify-between items-start">
                              <CardTitle>{goal.title}</CardTitle>
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
      <div className="mt-6">
         <Card className="flex items-center justify-center border-dashed hover:border-primary hover:bg-secondary/50 transition-colors cursor-pointer">
              <Button variant="ghost" className="flex flex-col h-auto gap-2 py-8 w-full">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                  <span className="text-muted-foreground">Add a New Goal</span>
              </Button>
          </Card>
      </div>

    </div>
  );
}
