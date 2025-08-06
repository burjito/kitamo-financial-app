
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

export interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    monthly_income: number | null;
    monthly_expenses: number | null;
    risk_profile: RiskProfile | null;
}

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
  profile: Profile | null;
  isLoading: boolean;
  monthlyIncome: number;
  monthlyExpenses: number;
  updateProfile: (data: Partial<Omit<Profile, 'id'>>) => Promise<void>;
}

const DEFAULT_MONTHLY_INCOME = 50000;
const DEFAULT_MONTHLY_EXPENSES = 35000;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const monthlyIncome = profile?.monthly_income ?? DEFAULT_MONTHLY_INCOME;
  const monthlyExpenses = profile?.monthly_expenses ?? DEFAULT_MONTHLY_EXPENSES;
  
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
            await fetchData(session.user);
        } else {
            setIsLoading(false);
        }
    }
    
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        await fetchData(currentUser);
      } else {
        setGoals([]);
        setScenarios([]);
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchData = async (user: User) => {
    if (!supabase) return;
    setIsLoading(true);
    try {
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (profileError && profileError.code !== 'PGRST116') { // PGRST116: no rows returned
            console.error("Error fetching profile:", profileError);
            throw profileError;
        }
        setProfile(profileData);
        
        const { data: goalsData, error: goalsError } = await supabase
            .from('goals')
            .select('id, user_id, title, target, current, status, priority, monthlyTarget:monthlyTarget')
            .eq('user_id', user.id);
        if (goalsError) throw goalsError;
        setGoals(goalsData || []);

        const { data: scenariosData, error: scenariosError } = await supabase
            .from('scenarios')
            .select('id, user_id, name, monthlyIncome:monthlyIncome, monthlyExpenses:monthlyExpenses, savingsGoal:savingsGoal, timeframe, goalType:goalType')
            .eq('user_id', user.id);
        if (scenariosError) throw scenariosError;
        setScenarios(scenariosData || []);
        
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Omit<Profile, 'id'>>) => {
      if (!user || !supabase) return;
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
          console.error("Error updating profile:", error);
          throw error;
      }
      if(updatedProfile) setProfile(updatedProfile);
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'user_id' | 'current' | 'status'>) => {
    if (!user || !supabase) return;
    const goalToAdd = { 
        title: goal.title,
        target: goal.target,
        monthlyTarget: goal.monthlyTarget,
        priority: goal.priority,
        user_id: user.id, 
        current: 0, 
        status: 'Active' 
    };
    const { data, error } = await supabase
        .from('goals')
        .insert([goalToAdd])
        .select('id, user_id, title, target, current, status, priority, monthlyTarget:monthlyTarget')
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
    const goalToUpdate = {
        title: rest.title,
        target: rest.target,
        monthlyTarget: rest.monthlyTarget,
        priority: rest.priority,
        status: rest.status,
        current: rest.current,
        user_id: user.id
    }
    const { data, error } = await supabase
        .from('goals')
        .update(goalToUpdate)
        .eq('id', id!)
        .select('id, user_id, title, target, current, status, priority, monthlyTarget:monthlyTarget')
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
        .select('id, user_id, title, target, current, status, priority, monthlyTarget:monthlyTarget')
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
     const scenarioToSave = {
      name: scenario.name,
      monthlyIncome: scenario.monthlyIncome,
      monthlyExpenses: scenario.monthlyExpenses,
      savingsGoal: scenario.savingsGoal,
      timeframe: scenario.timeframe,
      goalType: scenario.goalType,
      user_id: user.id
    };
    const { data, error } = await supabase
        .from('scenarios')
        .insert([scenarioToSave])
        .select('id, user_id, name, monthlyIncome:monthlyIncome, monthlyExpenses:monthlyExpenses, savingsGoal:savingsGoal, timeframe, goalType:goalType')
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
    profile,
    isLoading,
    monthlyIncome,
    monthlyExpenses,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    addFundsToGoal,
    scenarios,
    saveScenario,
    deleteScenario,
    updateProfile,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

    