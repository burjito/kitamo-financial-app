
"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Calculator, 
  TrendingUp, 
  PiggyBank, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Info,
  Car,
  Home,
  Briefcase,
  Plane,
  X,
  Lightbulb,
  Archive,
} from "lucide-react";
import { useAppContext } from '@/contexts/app-context';
import { useToast } from '@/hooks/use-toast';
import { SliderInput } from "./slider-input";
import { ProductRecommenderDialog } from "./product-recommender-dialog";


const goalTypes = {
  emergency: { icon: AlertTriangle, color: "text-yellow-500", name: "Emergency Fund" },
  vacation: { icon: Plane, color: "text-blue-500", name: "Vacation" },
  car: { icon: Car, color: "text-green-500", name: "Car Purchase" },
  house: { icon: Home, color: "text-red-500", name: "House Down Payment" },
  business: { icon: Briefcase, color: "text-purple-500", name: "Business Capital" }
};

export const WhatIfSimulator = () => {
  const { addGoal, saveScenario, scenarios, deleteScenario } = useAppContext();
  const { toast } = useToast();
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(35000);
  const [savingsGoal, setSavingsGoal] = useState(500000);
  const [timeframe, setTimeframe] = useState(24);
  const [goalType, setGoalType] = useState<keyof typeof goalTypes>("emergency");
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  
  const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
  const projectedSavings = monthlySavings * timeframe;
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;
  const goalProgress = savingsGoal > 0 ? (projectedSavings / savingsGoal) * 100 : 0;
  const monthsToGoal = monthlySavings > 0 ? Math.ceil(savingsGoal / monthlySavings) : Infinity;

  const goalInfo = goalTypes[goalType];
  const GoalIcon = goalInfo.icon;
  
  const handleValueChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (value: T) => {
    setter(value);
  };

  const handleSaveScenario = () => {
    saveScenario({
      id: Date.now().toString(),
      name: `${goalInfo.name} Scenario`,
      monthlyIncome,
      monthlyExpenses,
      savingsGoal,
      timeframe,
      goalType
    });
    
    toast({
      title: "Scenario Saved",
      description: "Your financial scenario has been saved and added to your LifePath."
    });
    setShowScenarios(true); // Automatically show the scenarios panel when a new one is saved
  };

  const handleSetAsGoal = () => {
    addGoal({
      id: Date.now().toString(),
      title: goalInfo.name,
      target: savingsGoal,
      current: 0,
      status: 'On Track',
    });
    
    toast({
      title: "Goal Created",
      description: `${goalInfo.name} has been added to your Goal Tracker.`
    });
  };
  
  const shortfall = savingsGoal - projectedSavings;

  return (
    <>
    <ProductRecommenderDialog 
        open={isRecommenderOpen}
        onOpenChange={setIsRecommenderOpen}
        scenario={{
            monthlyIncome,
            monthlyExpenses,
            savingsGoal,
            timeframe,
            goalType
        }}
    />
    <div className={`grid grid-cols-1 ${showScenarios ? 'lg:grid-cols-4' : ''} gap-8 items-start`}>
       <div className={`${showScenarios ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-8 transition-all duration-300`}>
        <Card>
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Financial Simulator
              </CardTitle>
              <CardDescription>
                Adjust your financial parameters and see real-time projections for your goals.
              </CardDescription>
            </div>
             <Button variant="outline" onClick={() => setShowScenarios(!showScenarios)}>
                <Archive className="mr-0 md:mr-2 h-4 w-4" />
                <span className="hidden md:inline">Saved Scenarios</span>
              </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="space-y-2">
                  <label htmlFor="goal-type" className="text-sm font-medium">Goal Type</label>
                  <Select value={goalType} onValueChange={(value) => setGoalType(value as keyof typeof goalTypes)}>
                    <SelectTrigger id="goal-type">
                      <SelectValue placeholder="Select goal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency Fund</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="car">Car Purchase</SelectItem>
                      <SelectItem value="house">House Down Payment</SelectItem>
                      <SelectItem value="business">Business Capital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <SliderInput
                  label="Monthly Income"
                  value={monthlyIncome}
                  onValueChange={handleValueChange(setMonthlyIncome)}
                  max={200000}
                  min={15000}
                  step={1000}
                  prefix="₱"
                />

                <SliderInput
                  label="Monthly Expenses"
                  value={monthlyExpenses}
                  onValueChange={handleValueChange(setMonthlyExpenses)}
                  max={monthlyIncome}
                  min={10000}
                  step={1000}
                  prefix="₱"
                />
                
                 <SliderInput
                  label="Savings Goal"
                  value={savingsGoal}
                  onValueChange={handleValueChange(setSavingsGoal)}
                  max={5000000}
                  min={50000}
                  step={10000}
                  prefix="₱"
                />
                
                <SliderInput
                  label="Timeframe"
                  value={timeframe}
                  onValueChange={handleValueChange(setTimeframe)}
                  max={120}
                  min={6}
                  step={1}
                  suffix="months"
                />
              </div>

              <div className="space-y-6">
                 <Card className="bg-primary/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GoalIcon className={`h-5 w-5 ${goalInfo.color}`} />
                      {goalInfo.name} Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 flex flex-col justify-between">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">₱{monthlySavings.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Monthly Savings</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">{savingsRate.toFixed(0)}%</div>
                        <div className="text-sm text-muted-foreground">Savings Rate</div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Goal Progress</span>
                        <span className="text-sm font-medium text-muted-foreground">{Math.min(goalProgress, 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(goalProgress, 100)} className="h-2" />
                       <div className="flex justify-between items-center mt-2 text-xs">
                          <span className="text-muted-foreground">Projected: ₱{projectedSavings.toLocaleString()}</span>
                          <span className="text-muted-foreground">Goal: ₱{savingsGoal.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                 <Card className="bg-secondary/5">
                   <CardHeader className="p-3">
                       <CardTitle className="text-base flex items-center gap-2">
                         <Info className="h-5 w-5 text-accent" />
                         AI Insights
                       </CardTitle>
                   </CardHeader>
                     <CardContent className="p-3 pt-0 text-sm">
                     {savingsRate < 20 && (
                       <div className="flex items-start gap-2 p-2 bg-yellow-500/10 rounded-lg text-yellow-700">
                         <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                         <p>Your savings rate is low. Try to increase it to at least 20%.</p>
                       </div>
                     )}
                     {goalProgress < 100 && monthlySavings > 0 && (
                       <div className="flex items-start gap-2 p-2 mt-2 bg-blue-500/10 rounded-lg text-blue-700">
                         <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
                         <p>You'll miss your goal by <strong>₱{shortfall.toLocaleString()}</strong>. You need about <strong>{monthsToGoal} months</strong> to reach it.</p>
                       </div>
                     )}
                     {goalProgress >= 100 && (
                         <div className="flex items-start gap-2 p-2 mt-2 bg-green-500/10 rounded-lg text-green-700">
                         <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                           <p>You're on track to reach your goal! You might even exceed it.</p>
                       </div>
                     )}
                       {monthlySavings <= 0 && (
                         <div className="flex items-start gap-2 p-2 mt-2 bg-red-500/10 rounded-lg text-red-700">
                         <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                           <p>Your expenses are higher than your income. You need to reduce expenses to start saving.</p>
                       </div>
                     )}
                     </CardContent>
                   </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <Button className="w-full md:col-span-1" onClick={handleSetAsGoal}>
                <PiggyBank className="mr-2 h-4 w-4" />
                Set as Goal
              </Button>
               <Button variant="outline" className="w-full md:col-span-1" onClick={handleSaveScenario}>
                <Target className="mr-2 h-4 w-4" />
                Save Scenario
              </Button>
              <Button className="w-full md:col-span-1" onClick={() => setIsRecommenderOpen(true)}>
                <Lightbulb className="mr-2 h-4 w-4" />
                Get AI Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {showScenarios && (
        <div className="lg:col-span-1 space-y-8 animate-in fade-in-0 slide-in-from-right-5 duration-500">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Saved Scenarios
              </CardTitle>
              <CardDescription>
                Your previously saved financial scenarios. These also appear on your LifePath.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {scenarios.map((scenario) => (
                  <Card key={scenario.id} className="bg-secondary/30">
                    <CardHeader className="pb-3 flex-row items-center justify-between">
                      <CardTitle className="text-base">{scenario.name}</CardTitle>
                       <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => scenario.id && deleteScenario(scenario.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                         <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                       <div className="flex justify-between">
                        <span className="text-muted-foreground">Goal:</span>
                        <span>₱{scenario.savingsGoal.toLocaleString()}</span>
                      </div>
                       <div className="flex justify-between">
                        <span className="text-muted-foreground">Timeframe:</span>
                        <span>{scenario.timeframe} months</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </>
  );
};
