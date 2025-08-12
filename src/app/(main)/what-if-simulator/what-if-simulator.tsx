"use client"

import { useState, useRef } from "react";
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
  RefreshCw,
  Calculator,
  Rocket,
  GraduationCap,
  Shield,
} from "lucide-react";
import { useAppContext } from '@/contexts/app-context';
import { useToast } from '@/hooks/use-toast';
import { SliderInput } from "./slider-input";
import { ProductRecommenderDialog } from "./product-recommender-dialog";
import { Scenario } from "@/contexts/app-context";

// Updated preset scenarios to match common BPI products
const presetScenarios = {
  car: { name: "Buy a New Car", amount: 700000, years: 5, months: 0, icon: Car },
  house: { name: "Buy a Dream Home", amount: 3000000, years: 15, months: 0, icon: Home },
  education: { name: "Education Fund", amount: 500000, years: 4, months: 0, icon: GraduationCap },
  vacation: { name: "Travel to Japan", amount: 100000, years: 2, months: 0, icon: Plane },
  emergency: { name: "Emergency Fund", amount: 300000, years: 2, months: 0, icon: Shield },
  business: { name: "Start a Business", amount: 800000, years: 3, months: 0, icon: Briefcase },
  laptop: { name: "Get a New Laptop", amount: 80000, years: 1, months: 0, icon: Laptop },
  wedding: { name: "Plan a Wedding", amount: 500000, years: 3, months: 0, icon: Heart },
};

// Comprehensive goal type detection function
const detectGoalType = (goalName: string): string => {
  const name = goalName.toLowerCase().trim();
  
  // Car and vehicle-related
  if (name.includes('car') || name.includes('vehicle') || name.includes('automobile') || name.includes('sedan') || name.includes('suv') || name.includes('truck')) {
    return 'car';
  }
  
  // Motorcycle and bike-related (only for very specific terms)
  if (name.includes('motorcycle') || name.includes('motorbike') || name.includes('scooter') || name.includes('big bike')) {
    return 'motorcycle';
  }
  
  // House and real estate-related
  if (name.includes('house') || name.includes('home') || name.includes('property') || name.includes('real estate') || 
      name.includes('condo') || name.includes('apartment') || name.includes('townhouse')) {
    return 'house';
  }
  
  // Education-related
  if (name.includes('education') || name.includes('school') || name.includes('college') || name.includes('university') || 
      name.includes('tuition') || name.includes('study') || name.includes('degree') || name.includes('course') ||
      name.includes('learning') || name.includes('training')) {
    return 'education';
  }
  
  // Business-related
  if (name.includes('business') || name.includes('startup') || name.includes('capital') || name.includes('franchise') ||
      name.includes('company') || name.includes('venture') || name.includes('shop') || name.includes('store')) {
    return 'business';
  }
  
  // Emergency fund-related
  if (name.includes('emergency') || name.includes('safety net') || name.includes('contingency') || 
      name.includes('rainy day') || name.includes('backup fund')) {
    return 'emergency';
  }
  
  // Technology and gadgets
  if (name.includes('laptop') || name.includes('computer') || name.includes('phone') || name.includes('gadget') || 
      name.includes('tech') || name.includes('tablet') || name.includes('device')) {
    return 'technology';
  }
  
  // Travel and vacation-related
  if (name.includes('vacation') || name.includes('travel') || name.includes('trip') || name.includes('holiday') ||
      name.includes('tour') || name.includes('journey') || name.includes('adventure')) {
    return 'vacation';
  }
  
  // Wedding and celebration-related
  if (name.includes('wedding') || name.includes('marriage') || name.includes('ceremony') || name.includes('celebration')) {
    return 'wedding';
  }
  
  // Investment-related
  if (name.includes('investment') || name.includes('invest') || name.includes('portfolio') || name.includes('stocks') || 
      name.includes('mutual fund') || name.includes('retirement') || name.includes('pension')) {
    return 'investment';
  }
  
  // Health and medical
  if (name.includes('health') || name.includes('medical') || name.includes('hospital') || name.includes('surgery') ||
      name.includes('treatment') || name.includes('insurance')) {
    return 'health';
  }
  
  // Generic savings goals
  if (name.includes('savings') || name.includes('save') || name.includes('fund')) {
    return 'savings';
  }
  
  // For very generic goals like "My Next Big Goal", "Dream Goal", etc.
  if (name.includes('goal') || name.includes('dream') || name.includes('plan') || name.includes('future') ||
      name.includes('next') || name.includes('big') || name.includes('major')) {
    return 'general';
  }
  
  return 'general';
};

export const WhatIfSimulator = () => {
  const { monthlyIncome: defaultMonthlyIncome, monthlyExpenses: defaultMonthlyExpenses, addGoal, saveScenario, scenarios, deleteScenario } = useAppContext();
  const { toast } = useToast();
  const [monthlyIncome, setMonthlyIncome] = useState(defaultMonthlyIncome);
  const [monthlyExpenses, setMonthlyExpenses] = useState(defaultMonthlyExpenses);
  const [goalName, setGoalName] = useState("My Next Big Goal");
  const [goalAmount, setGoalAmount] = useState(500000);
  const [timeframeYears, setTimeframeYears] = useState(4);
  const [timeframeMonths, setTimeframeMonths] = useState(2);
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const [detectedGoalType, setDetectedGoalType] = useState('general');
  const [currentScenarioPage, setCurrentScenarioPage] = useState(0);
  
  // Touch/swipe handling
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const swipeContainerRef = useRef<HTMLDivElement>(null);
  
  const timeframe = timeframeYears * 12 + timeframeMonths;
  const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
  const projectedSavings = monthlySavings * timeframe;
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;
  const goalProgress = goalAmount > 0 ? (projectedSavings / goalAmount) * 100 : 0;
  
  // Swipeable scenarios logic
  const scenarioEntries = Object.entries(presetScenarios);
  const scenariosPerPage = 2;
  const totalPages = Math.ceil(scenarioEntries.length / scenariosPerPage);
  const currentScenarios = scenarioEntries.slice(
    currentScenarioPage * scenariosPerPage,
    (currentScenarioPage + 1) * scenariosPerPage
  );
  
  const nextScenarioPage = () => {
    setCurrentScenarioPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevScenarioPage = () => {
    setCurrentScenarioPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentScenarioPage < totalPages - 1) {
      nextScenarioPage();
    }
    if (isRightSwipe && currentScenarioPage > 0) {
      prevScenarioPage();
    }
  };
  const monthsToGoal = monthlySavings > 0 ? Math.ceil(goalAmount / monthlySavings) : Infinity;

  const handleValueChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (value: T) => {
    setter(value);
  };

  // Enhanced goal name change handler
  const handleGoalNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGoalName = e.target.value;
    setGoalName(newGoalName);
    const detected = detectGoalType(newGoalName);
    setDetectedGoalType(detected);
  };
  
  const loadPreset = (preset: keyof typeof presetScenarios) => {
    const { name, amount, years, months } = presetScenarios[preset];
    setGoalName(name);
    setGoalAmount(amount);
    setTimeframeYears(years);
    setTimeframeMonths(months);
    const detected = detectGoalType(name);
    setDetectedGoalType(detected);
    toast({
        title: "Scenario Loaded!",
        description: `"${name}" scenario has been loaded into the simulator.`,
    });
  }

  const handleSaveScenario = () => {
    const scenarioToSave = {
      name: goalName,
      monthlyIncome,
      monthlyExpenses,
      savingsGoal: goalAmount,
      timeframe,
      goalType: detectGoalType(goalName)
    };
    saveScenario(scenarioToSave).then(() => {
        toast({
          title: "Scenario Saved",
          description: "Your financial scenario has been saved."
        });
        setShowScenarios(true);
    }).catch(e => {
        console.error(e);
        toast({ title: "Error", description: "Could not save the scenario.", variant: "destructive"});
    });
  };
  
  const loadScenario = (scenario: Scenario) => {
      setGoalName(scenario.name);
      setGoalAmount(scenario.savingsGoal);
      setMonthlyIncome(scenario.monthlyIncome);
      setMonthlyExpenses(scenario.monthlyExpenses);
      setTimeframeYears(Math.floor(scenario.timeframe / 12));
      setTimeframeMonths(scenario.timeframe % 12);
      const detected = detectGoalType(scenario.name);
      setDetectedGoalType(detected);
      toast({
          title: "Scenario Loaded",
          description: `"${scenario.name}" has been loaded into the simulator.`
      });
  };

  const handleSetAsGoal = () => {
    const goalToSave = {
      title: goalName,
      target: goalAmount,
      priority: 'Medium' as 'Medium',
      monthlyTarget: monthlySavings > 0 ? monthlySavings : 0
    };
    
    addGoal(goalToSave).then(() => {
        toast({
          title: "Goal Created",
          description: `${goalName} has been added to your Goal Tracker.`
        });
    }).catch(e => {
         console.error(e);
        toast({ title: "Error", description: "Could not create the goal.", variant: "destructive"});
    });
  };

  const handleDeleteScenario = (id: string) => {
    deleteScenario(id).then(() => {
       toast({
          title: "Scenario Deleted",
          description: "Your financial scenario has been removed."
        });
    }).catch(e => {
        console.error(e);
        toast({ title: "Error", description: "Could not delete the scenario.", variant: "destructive"});
    })
  }
  
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
              goalType: detectGoalType(goalName)
          }}
      />
        <Card>
            <CardHeader className="flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Calculator className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  Financial Simulator
                </CardTitle>
                <CardDescription className="text-sm">
                  Adjust your financial parameters and see real-time projections.
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowScenarios(!showScenarios)} className="w-full md:w-auto">
                <Archive className="mr-2 h-4 w-4" />
                Saved Scenarios
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className={`grid grid-cols-1 ${showScenarios ? 'lg:grid-cols-4' : ''} gap-4 md:gap-8 items-start`}>
                <div className={`${showScenarios ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-4 md:space-y-8 transition-all duration-300`}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base md:text-lg flex items-center gap-2">
                        <Rocket className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        Try a Common Scenario
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Get a head start by loading a preset goal that matches BPI products.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="hidden md:block">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                          {Object.entries(presetScenarios).map(([key, {name, icon: Icon}]) => (
                              <Button key={key} variant="outline" className="flex flex-col items-center justify-center h-20 md:h-24 p-3 md:p-4 text-center" onClick={() => loadPreset(key as keyof typeof presetScenarios)}>
                                  <Icon className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 text-primary" />
                                  <span className="text-xs md:text-sm text-wrap leading-tight">{name}</span>
                              </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Mobile swipeable view */}
                      <div className="md:hidden">
                        <div className="text-center mb-4">
                          <span className="text-xs text-muted-foreground">
                            Swipe to browse scenarios • {currentScenarioPage + 1} of {totalPages}
                          </span>
                        </div>
                        <div 
                          ref={swipeContainerRef}
                          className="overflow-hidden"
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        >
                          <div 
                            className="flex transition-transform duration-300 ease-out"
                            style={{ 
                              transform: `translateX(-${currentScenarioPage * 100}%)`,
                              width: `${totalPages * 100}%`
                            }}
                          >
                            {Array.from({ length: totalPages }).map((_, pageIndex) => (
                              <div key={pageIndex} className="grid grid-cols-2 gap-3 w-full flex-shrink-0">
                                {scenarioEntries
                                  .slice(pageIndex * scenariosPerPage, (pageIndex + 1) * scenariosPerPage)
                                  .map(([key, {name, icon: Icon}]) => (
                                    <Button key={key} variant="outline" className="flex flex-col items-center justify-center h-24 p-3 text-center" onClick={() => loadPreset(key as keyof typeof presetScenarios)}>
                                        <Icon className="h-6 w-6 mb-2 text-primary" />
                                        <span className="text-xs text-wrap leading-tight">{name}</span>
                                    </Button>
                                  ))}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-center mt-4 space-x-1">
                          {Array.from({ length: totalPages }).map((_, index) => (
                            <div
                              key={index}
                              className={`h-2 w-2 rounded-full transition-colors ${
                                index === currentScenarioPage ? 'bg-primary' : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="goal-name">Goal Name</Label>
                        <Input
                          id="goal-name"
                          placeholder="e.g., Dream Vacation, Education Fund, Emergency Savings"
                          value={goalName}
                          onChange={handleGoalNameChange}
                        />
                        {detectedGoalType !== 'general' && (
                          <p className="text-xs text-muted-foreground">
                            Detected goal type: {detectedGoalType}
                          </p>
                        )}
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
                      <Archive className="mr-2 h-4 w-4" />
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
                          Your previously saved financial scenarios.
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
                                            onClick={() => scenario.id && handleDeleteScenario(scenario.id)}
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
          </CardContent>
        </Card>
    </TooltipProvider>
  );
};