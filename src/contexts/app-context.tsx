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
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (id: string, updatedGoal: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  scenarios: Scenario[];
  saveScenario: (scenario: Omit<Scenario, 'id'>) => Promise<void>;
  deleteScenario: (id: string) => Promise<void>;
  user: { displayName: string } | null; // Simplified user object
  isLoading: boolean;
}

// Dummy Data for UI development
const dummyGoals: Goal[] = [
    { id: '1', title: 'Macbook Pro 14"', target: 150000, current: 88000, status: 'On Track' },
    { id: '2', title: 'Japan Trip 2025', target: 100000, current: 35000, status: 'Nearly There' },
    { id: '3', title: 'Emergency Fund', target: 250000, current: 245000, status: 'Needs Attention' },
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
    // Simulate fetching data
    setIsLoading(true);
    setTimeout(() => {
        setGoals(dummyGoals);
        setScenarios(dummyScenarios);
        setIsLoading(false);
    }, 1000);
  }, []);

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
        id: Date.now().toString(),
        ...goal
    };
    setGoals(prev => [...prev, newGoal]);
  };
  
  const updateGoal = async (id: string, updatedGoal: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? {...g, ...updatedGoal} : g));
  }

  const deleteGoal = async (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const saveScenario = async (scenario: Omit<Scenario, 'id'>) => {
    const newScenario = { id: Date.now().toString(), ...scenario };
    setScenarios(prev => [...prev, newScenario]);
  };
  
  const deleteScenario = async (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  }

  return (
    <AppContext.Provider value={{ user, isLoading, goals, addGoal, updateGoal, deleteGoal, scenarios, saveScenario, deleteScenario }}>
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
