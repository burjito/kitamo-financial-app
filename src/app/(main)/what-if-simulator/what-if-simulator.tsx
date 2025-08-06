
"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { 
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
  Laptop,
  Heart,
  X,
  Lightbulb,
  Archive,
  RefreshCw, // Added icon
  Calculator,
} from "lucide-react";
import { useAppContext } from '@/contexts/app-context';
import { useToast } from '@/hooks/use-toast';
import { SliderInput } from "./slider-input";
import { ProductRecommenderDialog } from "./product-recommender-dialog";

// We can move this to a shared file later if needed
const presetScenarios = {
  car: { name: "Buy a New Car", amount: 700000, years: 5, months: 0, icon: Car },
  laptop: { name: "Get a New Laptop", amount: 80000, years: 1, months: 0, icon: Laptop },
  vacation: { name: "Travel to Japan", amount: 100000, years: 2, months: 0, icon: Plane },
  wedding: { name: "Plan a Wedding", amount: 500000, years: 3, months: 0, icon: Heart },
};

export const WhatIfSimulator = () => {
  const { addGoal, saveScenario, scenarios, deleteScenario } = useAppContext();
  const { toast } = useToast();
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(35000);
  const [goalName, setGoalName] = useState("My Next Big Goal");
  const [goalAmount, setGoalAmount] = useState(500000);
  const [timeframeYears, setTimeframeYears] = useState(4);
  const [timeframeMonths, setTimeframeMonths] = useState(2);
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  
  const timeframe = timeframeYears * 12 + timeframeMonths;
  const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
  const projectedSavings = monthlySavings * timeframe;
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;
  const goalProgress = goalAmount > 0 ? (projectedSavings / goalAmount) * 100 : 0;
  const monthsToGoal = monthlySavings > 0 ? Math.ceil(goalAmount / monthlySavings) : Infinity;

  const handleValueChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (value: T) => {
    setter(value);
  };
  
  const loadPreset = (preset: keyof typeof presetScenarios) => {
    const { name, amount, years, months } = presetScenarios[preset];
    setGoalName(name);
    setGoalAmount(amount);
    setTimeframeYears(years);
    setTimeframeMonths(months);
    toast({
        title: "Scenario Loaded!",
        description: `"${name}" scenario has been loaded into the simulator.`,
    });
  }

  const handleSaveScenario = () => {
    saveScenario({
      id: Date.now().toString(),
      name: goalName,
      monthlyIncome,
      monthlyExpenses,
      savingsGoal: goalAmount,
      timeframe,
      goalType: goalName.toLowerCase().includes('car') ? 'car' : (goalName.toLowerCase().includes('laptop') ? 'laptop' : (goalName.toLowerCase().includes('vacation') ? 'vacation' : (goalName.toLowerCase().includes('wedding') ? 'heart' : 'default')))
    });
    
    toast({
      title: "Scenario Saved",
      description: "Your financial scenario has been saved and added to your LifePath."
    });
    setShowScenarios(true); // Automatically show the scenarios panel when a new one is saved
  };
  
  const loadScenario = (scenario: typeof scenarios[0]) => {
      setGoalName(scenario.name);
      setGoalAmount(scenario.savingsGoal);
      setMonthlyIncome(scenario.monthlyIncome);
      setMonthlyExpenses(scenario.monthlyExpenses);
      setTimeframeYears(Math.floor(scenario.timeframe / 12));
      setTimeframeMonths(scenario.timeframe % 12);
      toast({
          title: "Scenario Loaded",
          description: `"${scenario.name}" has been loaded into the simulator.`
      });
  };

  const handleSetAsGoal = () => {
    addGoal({
      id: Date.now().toString(),
      title: goalName,
      target: goalAmount,
      current: 0,
      status: 'On Track',
      priority: 'Medium',
      monthlyTarget: monthlySavings > 0 ? monthlySavings : 0
    });
    
    toast({
      title: "Goal Created",
      description: `${goalName} has been added to your Goal Tracker.`
    });
  };
  
  const shortfall = goalAmount - projectedSavings;

  return (
    <TooltipProvider>
      <ProductRecommenderDialog 
          open={isRecommenderOpen}
          onOpenChange={setIsRecommenderOpen}
          scenario={{
              monthlyIncome,
              monthlyExpenses,
              savingsGoal: goalAmount,
              timeframe,
              goalType: goalName.toLowerCase().includes('car') ? 'car' : 'default'
          }}
      />

      <div className={`grid grid-cols-1 ${showScenarios ? 'lg:grid-cols-4' : ''} gap-8 items-start`}>
        <div className={`${showScenarios ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-8 transition-all duration-300`}>
          <Card>
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-primary" />
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
            <CardContent>
              <div className="mb-6 space-y-2">
                <Label>Try a Common Scenario</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(presetScenarios).map(([key, {name, icon: Icon}]) => (
                      <Button key={key} variant="outline" className="flex flex-col h-20" onClick={() => loadPreset(key as keyof typeof presetScenarios)}>
                          <Icon className="h-6 w-6 mb-1 text-primary" />
                          <span className="text-center text-xs text-wrap">{name}</span>
                      </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="goal-name">Goal Name</Label>
                    <Input
                      id="goal-name"
                      placeholder="e.g., Dream Vacation"
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                    />
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
                    label="Goal Amount"
                    value={goalAmount}
                    onValueChange={handleValueChange(setGoalAmount)}
                    max={5000000}
                    min={10000}
                    step={10000}
                    prefix="₱"
                  />
                  
                  <div className="space-y-2">
                    <Label>Timeframe</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="timeframe-years" className="text-xs text-muted-foreground">Years</Label>
                        <Input id="timeframe-years" type="number" value={timeframeYears} onChange={e => setTimeframeYears(Number(e.target.value))} min={0} max={40} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="timeframe-months" className="text-xs text-muted-foreground">Months</Label>
                        <Input id="timeframe-months" type="number" value={timeframeMonths} onChange={e => setTimeframeMonths(Number(e.target.value))} min={0} max={11} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 flex flex-col">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className={`h-5 w-5 text-primary`} />
                        {goalName} Projection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                            <span className="text-muted-foreground">Goal: ₱{goalAmount.toLocaleString()}</span>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                 <Button variant="outline" className="w-full" onClick={handleSaveScenario}>
                  <Target className="mr-2 h-4 w-4" />
                  Save Scenario
                </Button>
                <Button className="w-full" onClick={handleSetAsGoal}>
                  <PiggyBank className="mr-2 h-4 w-4" />
                  Set as Goal
                </Button>
                 <Button variant="secondary" className="w-full" onClick={() => setIsRecommenderOpen(true)}>
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
                <CardTitle className="flex items-center gap-2 text-lg">
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
                      <CardHeader className="p-4 pb-2 flex-row items-center justify-between">
                        <CardTitle className="text-base">{scenario.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => loadScenario(scenario)}
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                                >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Load Scenario</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                             <TooltipTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => scenario.id && deleteScenario(scenario.id)}
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                  >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Scenario</p>
                              </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-3 space-y-1 text-sm">
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
                  {scenarios.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No saved scenarios yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
