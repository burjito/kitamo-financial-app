"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';

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
  addGoal: (goal: Omit<Goal, 'id' | 'current' | 'status'> & Partial<Goal>) => Promise<void>;
  updateGoal: (id: string, updatedGoal: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  scenarios: Scenario[];
  saveScenario: (scenario: Omit<Scenario, 'id'>) => Promise<void>;
  deleteScenario: (id: string) => Promise<void>;
  user: User | null;
  isLoading: boolean;
}

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      setUser(currentUser);
      if (currentUser) {
        // Fetch goals from Firestore
        try {
            const goalsCollectionRef = collection(db, 'users', currentUser.uid, 'goals');
            const goalsSnapshot = await getDocs(goalsCollectionRef);
            const fetchedGoals = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Goal[];
            setGoals(fetchedGoals);

            // Fetch scenarios from Firestore
            const scenariosCollectionRef = collection(db, 'users', currentUser.uid, 'scenarios');
            const scenariosSnapshot = await getDocs(scenariosCollectionRef);
            const fetchedScenarios = scenariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Scenario[];
            setScenarios(fetchedScenarios);
        } catch (error) {
            console.error("Error fetching user data:", error)
        }

      } else {
        // Reset state when user logs out
        setGoals([]);
        setScenarios([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addGoal = async (goal: Omit<Goal, 'id' | 'current' | 'status'> & Partial<Goal>) => {
    if (!user) throw new Error("No user logged in to add a goal");

    const newGoal: Goal = {
        current: 0,
        status: 'On Track',
        ...goal
    };

    const goalsCollectionRef = collection(db, 'users', user.uid, 'goals');
    const docRef = await addDoc(goalsCollectionRef, newGoal);
    setGoals(prev => [...prev, { id: docRef.id, ...newGoal }]);
  };
  
  const updateGoal = async (id: string, updatedGoal: Partial<Goal>) => {
    if (!user) throw new Error("No user logged in to update a goal");
    const goalDocRef = doc(db, 'users', user.uid, 'goals', id);
    await setDoc(goalDocRef, updatedGoal, { merge: true });
    setGoals(prev => prev.map(g => g.id === id ? {...g, ...updatedGoal} : g));
  }

  const deleteGoal = async (id: string) => {
    if (!user) throw new Error("No user logged in to delete a goal");
    const goalDocRef = doc(db, 'users', user.uid, 'goals', id);
    await deleteDoc(goalDocRef);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const saveScenario = async (scenario: Omit<Scenario, 'id'>) => {
    if (!user) throw new Error("No user logged in to save a scenario");
    const scenariosCollectionRef = collection(db, 'users', user.uid, 'scenarios');
    const docRef = await addDoc(scenariosCollectionRef, scenario);
    setScenarios(prev => [...prev, { id: docRef.id, ...scenario }]);
  };
  
  const deleteScenario = async (id: string) => {
    if (!user) throw new Error("No user logged in to delete a scenario");
    const scenarioDocRef = doc(db, 'users', user.uid, 'scenarios', id);
    await deleteDoc(scenarioDocRef);
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
