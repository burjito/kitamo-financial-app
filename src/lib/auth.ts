
import { supabase } from './supabase'

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface SignInData {
  email: string
  password: string
}

export const signUp = async ({ email, password, firstName, lastName }: SignUpData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    }
  })
  
  return { data, error }
}

export const signIn = async ({ email, password }: SignInData) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}
