"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types
export interface Goal {
  id?: string;
  title: string;
  target: number;
  current: number;
  status: string;
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
  deleteGoal: (id: string) => void;
  scenarios: Scenario[];
  saveScenario: (scenario: Scenario) => void;
  deleteScenario: (id: string) => void;
  user: { displayName: string } | null;
  isLoading: boolean;
}

// Dummy Data for UI development
const dummyGoals: Goal[] = [
    { id: '1', title: 'Macbook Pro 14"', target: 150000, current: 88000, status: 'On Track' },
    { id: '2', title: 'Japan Trip 2025', target: 100000, current: 35000, status: 'Needs Attention' },
    { id: '3', title: 'Emergency Fund', target: 250000, current: 245000, status: 'Nearly There' },
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
    goals,
    addGoal,
    deleteGoal,
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
