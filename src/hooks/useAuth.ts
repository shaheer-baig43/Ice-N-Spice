"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Profile } from "@/types"
import { User } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn("Profile not found for user:", userId)
          setProfile(null)
          return
        }
        throw error
      }
      setProfile(data)
    } catch (error: unknown) {
      const err = error as { message?: string; details?: string; hint?: string }
      console.error("Error fetching profile:", err?.message || error)
      if (err?.details) console.error("Details:", err.details)
      if (err?.hint) console.error("Hint:", err.hint)
    } finally {
      // Always reset loading — prevents app hanging in loading state if fetch throws
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!mounted) return

      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return

      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        await fetchProfile(currentUser.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const isAdmin = profile?.role === "admin"

  return { user, profile, isAdmin, loading }
}
