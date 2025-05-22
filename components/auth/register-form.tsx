"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Github, Mail } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { checkEmailExists } from "@/actions/auth-actions" // Import the server action

export default function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const { signUp } = useAuth()
  const supabase = createClientSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    if (name.trim().length < 2) {
      setError("Full name must be at least 2 characters long")
      setIsLoading(false)
      return
    }

    try {
      // Check if email already exists using server action
      const emailExists = await checkEmailExists(email.toLowerCase().trim())
      
      if (emailExists) {
        setError("An account with this email already exists. Please try logging in instead.")
        setIsLoading(false)
        return
      }

      // Proceed with registration
      await signUp(email.toLowerCase().trim(), password, name.trim())
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully. Please check your email for verification.",
      })
      
      // Clear form
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      
      router.push("/auth/login?message=Please check your email to verify your account")
      
    } catch (err: any) {
      console.error("Registration error:", err)
      
      // Handle specific Supabase errors
      if (err.message?.toLowerCase().includes("user already registered") || 
          err.message?.toLowerCase().includes("email already exists")) {
        setError("An account with this email already exists. Please try logging in instead.")
      } else if (err.message?.toLowerCase().includes("email")) {
        setError("Please enter a valid email address.")
      } else if (err.message?.toLowerCase().includes("password")) {
        setError("Password is too weak. Please use a stronger password with at least 6 characters.")
      } else if (err.message?.toLowerCase().includes("invalid")) {
        setError("Please check your information and try again.")
      } else {
        setError(err.message || "Failed to create account. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    setIsLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err: any) {
      setError(`Failed to sign in with ${provider}. Please try again.`)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          placeholder="John Doe" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          minLength={2}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" required disabled={isLoading} />
        <Label htmlFor="terms" className="text-sm">
          I agree to the{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" onClick={() => handleOAuthSignIn("github")} disabled={isLoading}>
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline" type="button" onClick={() => handleOAuthSignIn("google")} disabled={isLoading}>
          <Mail className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </form>
  )
}