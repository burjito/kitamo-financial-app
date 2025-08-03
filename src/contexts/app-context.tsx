
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types
export interface Goal {
  id?: string;
  title: string;
  target: number;
  current: number;
  status: string;
  priority: 'High' | 'Medium' | 'Low';
  monthlyTarget: number;
}

export interface Scenario {
  id?: string;
  name: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
  timeframe: number;
  goalType: string;
}

interface AppContextType {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  addFundsToGoal: (id: string, amount: number) => void;
  scenarios: Scenario[];
  saveScenario: (scenario: Scenario) => void;
  deleteScenario: (id: string) => void;
  user: { displayName: string } | null;
  isLoading: boolean;
  monthlyIncome: number;
}

// Dummy Data for UI development
const DUMMY_MONTHLY_INCOME = 50000;

const dummyGoals: Goal[] = [
    { id: '1', title: 'Emergency Fund', target: 300000, current: 75000, status: 'Active', priority: 'High', monthlyTarget: 15000 },
    { id: '2', title: 'Japan Trip 2025', target: 100000, current: 35000, status: 'Active', priority: 'Medium', monthlyTarget: 10000 },
    { id: '3', title: 'Macbook Pro 14"', target: 150000, current: 145000, status: 'Paused', priority: 'Low', monthlyTarget: 5000 },
];

const dummyScenarios: Scenario[] = [
    { id: '1', name: 'House Down Payment Scenario', monthlyIncome: 80000, monthlyExpenses: 50000, savingsGoal: 1000000, timeframe: 60, goalType: 'house' },
    { id: '2', name: 'New Car Scenario', monthlyIncome: 80000, monthlyExpenses: 50000, savingsGoal: 500000, timeframe: 36, goalType: 'car' },
];


// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [user, setUser] = useState<{displayName: string} | null>({displayName: "Alex"});
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyIncome, setMonthlyIncome] = useState(DUMMY_MONTHLY_INCOME);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
        setGoals(dummyGoals);
        setScenarios(dummyScenarios);
        setIsLoading(false);
    }, 1000);
  }, []);

  const addGoal = (goal: Goal) => {
    setGoals(prev => [...prev, { ...goal, id: Date.now().toString() }]);
  };
  
  const updateGoal = (updatedGoal: Goal) => {
    setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };
  
  const addFundsToGoal = (id: string, amount: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, current: g.current + amount } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const saveScenario = (scenario: Scenario) => {
    setScenarios(prev => [...prev, { ...scenario, id: Date.now().toString() }]);
  };
  
  const deleteScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  }

  const value: AppContextType = {
    user,
    isLoading,
    monthlyIncome,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    addFundsToGoal,
    scenarios,
    saveScenario,
    deleteScenario
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
