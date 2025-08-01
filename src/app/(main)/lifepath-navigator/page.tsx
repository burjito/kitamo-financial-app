"use client";

import { BaggageClaim, Briefcase, GraduationCap, Heart, Home, Plus, AlertTriangle, Plane, Target, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/contexts/app-context";
import { Skeleton } from "@/components/ui/skeleton";

// We can move this to a shared file later if needed
const goalTypes = {
  emergency: { icon: AlertTriangle, color: "text-yellow-500", name: "Emergency Fund" },
  vacation: { icon: Plane, color: "text-blue-500", name: "Vacation" },
  car: { icon: Car, color: "text-green-500", name: "Car Purchase" },
  house: { icon: Home, color: "text-red-500", name: "House Down Payment" },
  business: { icon: Briefcase, color: "text-purple-500", name: "Business Capital" },
  default: { icon: Target, color: "text-primary", name: "Goal"}
};

// Helper function to get an icon for a given goal type
const getIconForGoalType = (type: string): React.ElementType => {
    const goalInfo = (goalTypes as any)[type] || goalTypes.default;
    return goalInfo.icon;
};


export default function LifepathNavigatorPage() {
  const { scenarios, isLoading } = useAppContext();

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
    <div className="animate-in fade-in-0 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="space-y-2 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            LifePath Navigator
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Map out your life's biggest milestones. See how your goals connect and plan your financial journey with a clear timeline.
          </p>
        </div>
         <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Milestone
          </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Your Life Timeline</CardTitle>
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
              <div className="p-3 bg-secondary rounded-lg">
                <p className="text-sm font-medium text-secondary-foreground">Feasibility Check</p>
                <p className="text-xs text-muted-foreground">Your plan is ambitious but achievable. Watch for tight cash flow around 2028.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
