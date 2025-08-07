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
  
  const fetchData = async (user: User) => {
    if (!supabase) return;
    setIsLoading(true);
    try {
        console.log('Fetching data for user:', user.id);
        
        // Profiles table uses snake_case
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, monthly_income, monthly_expenses, risk_profile')
            .eq('id', user.id)
            .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching profile:", profileError);
            throw profileError;
        }
        console.log('Fetched profile data:', profileData);
        setProfile(profileData);
        
        // Goals table uses camelCase with quotes (based on your schema)
        const { data: goalsData, error: goalsError } = await supabase
            .from('goals')
            .select('id, user_id, title, target, current, status, priority, "monthlyTarget"')
            .eq('user_id', user.id);
        
        if (goalsError) {
            console.error("Error fetching goals:", goalsError);
            throw goalsError;
        }
        console.log('Goals fetched:', goalsData);
        setGoals(goalsData || []);

        // Scenarios table uses camelCase with quotes (based on your schema)
        const { data: scenariosData, error: scenariosError } = await supabase
            .from('scenarios')
            .select('id, user_id, name, "monthlyIncome", "monthlyExpenses", "savingsGoal", timeframe, "goalType"')
            .eq('user_id', user.id);
        
        if (scenariosError) {
            console.error("Error fetching scenarios:", scenariosError);
            throw scenariosError;
        }
        console.log('Scenarios fetched:', scenariosData);
        setScenarios(scenariosData || []);
        
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!supabase) {
        console.warn("Supabase not initialized. Skipping authentication and data fetching.");
        setIsLoading(false);
        return;
    }

    const getInitialSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if(error) {
            console.error("Error getting session:", error);
            setIsLoading(false);
            return;
        }

        if (session?.user) {
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

  const updateProfile = async (data: Partial<Omit<Profile, 'id'>>) => {
      if (!user || !supabase) {
          console.error("Cannot update profile: User not authenticated or Supabase not available");
          throw new Error("Cannot update profile: User not authenticated.");
      }
      
      console.log('Updating profile with data:', data);
      console.log('User ID:', user.id);
      
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
          console.error("Error updating profile:", error);
          console.error("Error details:", error.details, error.hint, error.code);
          throw error;
      }
      
      console.log('Profile updated successfully:', updatedProfile);
      if(updatedProfile) setProfile(updatedProfile);
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'user_id' | 'current' | 'status'>) => {
    if (!user || !supabase) throw new Error("Cannot add goal: User not authenticated.");
    
    console.log('Adding goal:', goal);
    
    // Goals table uses camelCase with quotes for monthlyTarget
    const goalToAdd = { 
        user_id: user.id,
        title: goal.title,
        target: goal.target,
        priority: goal.priority,
        monthlyTarget: goal.monthlyTarget, // This maps to "monthlyTarget" in the database
        current: 0, 
        status: 'Active'
    };

    console.log('Goal to add to database:', goalToAdd);

    const { data, error } = await supabase.from('goals').insert(goalToAdd).select();

    if (error) {
        console.error('Error adding goal:', error);
        console.error('Error details:', error.details, error.hint, error.code);
        throw error;
    }
    
    console.log('Successfully added goal:', data);
    await fetchData(user);
  };
  
  const updateGoal = async (updatedGoal: Goal) => {
    if (!user || !supabase || !updatedGoal.id) return;
    
    const { id, user_id, ...goalToUpdate } = updatedGoal;

    const { error } = await supabase
        .from('goals')
        .update(goalToUpdate)
        .eq('id', updatedGoal.id);

    if (error) {
        console.error('Error updating goal:', error);
        throw error;
    }
    await fetchData(user);
  };
  
  const addFundsToGoal = async (id: string, amount: number) => {
    if (!user || !supabase) return;
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newCurrentAmount = goal.current + amount;
    const { error } = await supabase
        .from('goals')
        .update({ current: newCurrentAmount })
        .eq('id', id);
    
    if (error) {
        console.error('Error adding funds:', error);
        throw error;
    }
    await fetchData(user);
  };

  const deleteGoal = async (id: string) => {
    if (!user || !supabase) return;
    const { error } = await supabase.from('goals').delete().eq('id', id);
        
    if (error) {
        console.error('Error deleting goal:', error);
        throw error;
    }
    await fetchData(user);
  };

  const saveScenario = async (scenario: Omit<Scenario, 'id' | 'user_id'>) => {
    if (!user || !supabase) throw new Error("Cannot save scenario: User not authenticated.");
    
    console.log('Saving scenario:', scenario);
     
    // Scenarios table uses camelCase with quotes
    const scenarioToSave = {
        user_id: user.id,
        name: scenario.name,
        monthlyIncome: scenario.monthlyIncome,     // Maps to "monthlyIncome"
        monthlyExpenses: scenario.monthlyExpenses, // Maps to "monthlyExpenses"
        savingsGoal: scenario.savingsGoal,         // Maps to "savingsGoal"
        timeframe: scenario.timeframe,
        goalType: scenario.goalType                // Maps to "goalType"
    };

    console.log('Scenario to save to database:', scenarioToSave);

    const { data, error } = await supabase.from('scenarios').insert(scenarioToSave).select();
        
    if (error) {
        console.error('Error saving scenario:', error);
        console.error('Error details:', error.details, error.hint, error.code);
        throw error;
    }
    
    console.log('Successfully saved scenario:', data);
    await fetchData(user);
  };
  
  const deleteScenario = async (id: string) => {
    if (!user || !supabase) return;
     const { error } = await supabase.from('scenarios').delete().eq('id', id);
    if (error) {
        console.error('Error deleting scenario:', error);
        throw error;
    }
    await fetchData(user);
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