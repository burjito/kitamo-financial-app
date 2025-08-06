
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import supabase from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';

// Types
export interface Goal {
  id?: string;
  user_id?: string;
  title: string;
  target: number;
  current: number;
  status: string;
  priority: 'High' | 'Medium' | 'Low';
  monthlyTarget: number;
}

export interface Scenario {
  id?: string;
  user_id?: string;
  name: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
  timeframe: number;
  goalType: string;
}

type RiskProfile = "Conservative" | "Moderately Conservative" | "Moderate" | "Aggressive";

interface AppContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'current' | 'status'>) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addFundsToGoal: (id: string, amount: number) => Promise<void>;
  scenarios: Scenario[];
  saveScenario: (scenario: Omit<Scenario, 'id' | 'user_id'>) => Promise<void>;
  deleteScenario: (id: string) => Promise<void>;
  user: User | null;
  isLoading: boolean;
  monthlyIncome: number;
  setMonthlyIncome: React.Dispatch<React.SetStateAction<number>>;
  monthlyExpenses: number;
  setMonthlyExpenses: React.Dispatch<React.SetStateAction<number>>;
  riskProfile: RiskProfile | null;
  setRiskProfile: (profile: RiskProfile) => void;
}

// Default values, can be overridden by user settings later
const DEFAULT_MONTHLY_INCOME = 50000;
const DEFAULT_MONTHLY_EXPENSES = 35000;

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyIncome, setMonthlyIncome] = useState(DEFAULT_MONTHLY_INCOME);
  const [monthlyExpenses, setMonthlyExpenses] = useState(DEFAULT_MONTHLY_EXPENSES);
  const [riskProfile, setRiskProfileState] = useState<RiskProfile | null>(null);

  const setRiskProfile = (profile: RiskProfile) => {
    setRiskProfileState(profile);
    // In a real app, you'd save this to the database
    // For now, we'll use localStorage to persist it across sessions
    localStorage.setItem('riskProfile', profile);
  };
  
  useEffect(() => {
    if (!supabase) {
        console.warn("Supabase not initialized. Skipping authentication and data fetching.");
        setIsLoading(false);
        return;
    }

    const getInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            setUser(session.user);
            fetchData(session.user.id);
        } else {
            setIsLoading(false);
        }
    }
    
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        fetchData(currentUser.id);
      } else {
        setGoals([]);
        setScenarios([]);
        setMonthlyIncome(DEFAULT_MONTHLY_INCOME);
        setMonthlyExpenses(DEFAULT_MONTHLY_EXPENSES);
        setRiskProfileState(null);
        localStorage.removeItem('riskProfile');
        setIsLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchData = async (userId: string) => {
    if (!supabase) return;
    setIsLoading(true);
    try {
        const { data: goalsData, error: goalsError } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId);
        if (goalsError) throw goalsError;
        setGoals(goalsData || []);

        const { data: scenariosData, error: scenariosError } = await supabase
            .from('scenarios')
            .select('*')
            .eq('user_id', userId);
        if (scenariosError) throw scenariosError;
        setScenarios(scenariosData || []);
        
        // Fetch user preferences for income/expenses/risk profile here from DB.
        // For now, we'll use local state and localStorage for persistence.
        const storedProfile = localStorage.getItem('riskProfile') as RiskProfile | null;
        if (storedProfile) {
            setRiskProfileState(storedProfile);
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'user_id' | 'current' | 'status'>) => {
    if (!user || !supabase) return;
    const goalToAdd = { ...goal, user_id: user.id, current: 0, status: 'Active' };
    const { data, error } = await supabase
        .from('goals')
        .insert([goalToAdd])
        .select()
        .single();

    if (error) {
        console.error('Error adding goal:', error);
        throw error;
    }
    if (data) setGoals(prev => [...prev, data]);
  };
  
  const updateGoal = async (updatedGoal: Goal) => {
    if (!user || !supabase) return;
    const { id, ...rest } = updatedGoal;
    const { data, error } = await supabase
        .from('goals')
        .update({ ...rest, user_id: user.id })
        .eq('id', id!)
        .select()
        .single();
    if (error) {
        console.error('Error updating goal:', error);
        throw error;
    }
    if (data) setGoals(prev => prev.map(g => g.id === data.id ? data : g));
  };
  
  const addFundsToGoal = async (id: string, amount: number) => {
    if (!user || !supabase) return;
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newCurrentAmount = goal.current + amount;
    const { data, error } = await supabase
        .from('goals')
        .update({ current: newCurrentAmount })
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        console.error('Error adding funds:', error);
        throw error;
    }
    if (data) setGoals(prev => prev.map(g => g.id === data.id ? data : g));
  };

  const deleteGoal = async (id: string) => {
    if (!user || !supabase) return;
    const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('Error deleting goal:', error);
        throw error;
    }
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const saveScenario = async (scenario: Omit<Scenario, 'id' | 'user_id'>) => {
    if (!user || !supabase) return;
    const { data, error } = await supabase
        .from('scenarios')
        .insert([{ ...scenario, user_id: user.id }])
        .select()
        .single();
    if (error) {
        console.error('Error saving scenario:', error);
        throw error;
    }
    if (data) setScenarios(prev => [...prev, data]);
  };
  
  const deleteScenario = async (id: string) => {
    if (!user || !supabase) return;
     const { error } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('Error deleting scenario:', error);
        throw error;
    }
    setScenarios(prev => prev.filter(s => s.id !== id));
  }

  const value: AppContextType = {
    user,
    isLoading,
    monthlyIncome,
    setMonthlyIncome,
    monthlyExpenses,
    setMonthlyExpenses,
    riskProfile,
    setRiskProfile,
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
