"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

// Check if email already exists in the system
export async function checkEmailExists(email: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  try {
    // Check if email exists in profiles table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", email)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error checking email:", error)
      return false
    }

    return !!profile
  } catch (err) {
    console.error("Error in checkEmailExists:", err)
    return false
  }
}

// Alternative: Get user by email (if you need more user info)
export async function getUserByEmail(email: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("email", email)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user by email:", error)
      return null
    }

    return profile
  } catch (err) {
    console.error("Error in getUserByEmail:", err)
    return null
  }
}