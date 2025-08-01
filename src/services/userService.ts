import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, getDocs } from 'firebase/firestore';

export interface UserProfile {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  financialReadinessScore?: number;
}

export interface Goal {
  id?: string;
  title: string;
  target: number;
  current: number;
  status: string;
  timelineMonths?: number;
}

const usersCollection = collection(db, 'users');

export const createUserProfile = async (userId: string, data: Omit<UserProfile, 'id'>) => {
  await setDoc(doc(db, 'users', userId), data);
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  await updateDoc(doc(db, 'users', userId), data);
};

export const addGoalToUser = async (userId: string, goal: Omit<Goal, 'id'>) => {
    const goalsCollection = collection(db, 'users', userId, 'goals');
    const docRef = await addDoc(goalsCollection, goal);
    return docRef.id;
}

export const getGoalsForUser = async (userId: string): Promise<Goal[]> => {
    const goalsCollection = collection(db, 'users', userId, 'goals');
    const querySnapshot = await getDocs(goalsCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
}
