"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type UserWithProfile = User & { profile: Profile | null }

type AuthContextType = {
  user: UserWithProfile | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (profile: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true)

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Error fetching session:", error)
        setIsLoading(false)
        return
      }

      console.log("--------------------Session:---------------------", session)
      

      if (session) {
        setSession(session)
        await fetchUserProfile(session.user)
      }

      setIsLoading(false)
    }

    fetchSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setSession(session)
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
        setSession(null)
      }

      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const fetchUserProfile = async (authUser: User) => {
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error)
    }

    setUser({ ...authUser, profile: profile as Profile })
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        // Handle specific Supabase signup errors
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please login instead.')
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address. Check your inbox for the confirmation link.')
        } else if (error.message.includes('Password should be at least 6 characters')) {
          throw new Error('Password must be at least 6 characters long.')
        } else if (error.message.includes('Unable to validate email address')) {
          throw new Error('Please enter a valid email address.')
        } else if (error.message.includes('signup is disabled')) {
          throw new Error('Registration is currently disabled. Please contact support.')
        }
        throw error
      }

      // Create profile only if user was created successfully
      if (data.user && !error) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (profileError) {
          console.error("Error creating profile:", profileError)
          // Don't throw here as the user account was created successfully
          // The profile can be created later
        }
      }

      // Check if user needs email confirmation
      if (data.user && !data.session) {
        // User was created but needs email confirmation
        return
      }

    } catch (error: any) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  const updateProfile = async (profile: Partial<Profile>) => {
    if (!user) throw new Error("User not authenticated")

    setIsLoading(true)
    try {
      // Update auth metadata if needed
      if (profile.full_name) {
        await supabase.auth.updateUser({
          data: { full_name: profile.full_name },
        })
      }

      // Update profile
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      // Update local user state
      setUser({ ...user, profile: { ...user.profile, ...profile } as Profile })
    } catch (error) {
      console.error("Profile update error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)