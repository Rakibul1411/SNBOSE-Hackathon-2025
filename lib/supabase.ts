import { createClient } from '@supabase/supabase-js'

// Server-side (safe for API routes or Server Components)
export const createServerSupabaseClient = () => {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) throw new Error("Missing Supabase server environment variables")

  return createClient(url, key)
}

// Client-side singleton
let client: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) throw new Error("Missing Supabase client environment variables")

  if (!client) {
    client = createClient(url, key)
  }

  return client
}
