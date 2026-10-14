import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

interface AdminAuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  hasMfaEnrolled: boolean
  isMfaVerified: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null; requires2FA: boolean }>
  verifyMfa: (code: string) => Promise<{ error: Error | null }>
  refreshMfaState: () => Promise<void>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  session: null,
  loading: true,
  hasMfaEnrolled: false,
  isMfaVerified: false,
  signIn: async () => ({ error: null, requires2FA: false }),
  verifyMfa: async () => ({ error: null }),
  refreshMfaState: async () => {},
  signOut: async () => {},
})

export function AdminAuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [hasMfaEnrolled, setHasMfaEnrolled] = useState<boolean>(false)
  const [isMfaVerified, setIsMfaVerified] = useState<boolean>(false)

  const checkMfa = async (currentUser: User | null) => {
    if (!currentUser) {
      setHasMfaEnrolled(false)
      setIsMfaVerified(false)
      return
    }

    try {
      const [aalRes, factorsRes] = await Promise.all([
        supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
        supabase.auth.mfa.listFactors(),
      ])

      const verifiedFactors = factorsRes.data?.totp?.filter((f) => f.status === 'verified') || []
      const hasEnrolled = verifiedFactors.length > 0
      setHasMfaEnrolled(hasEnrolled)

      const isDev = import.meta.env.VITE_IS_DEV === 'true'

      // If in dev mode, bypass 2FA verification requirement
      if (isDev) {
        setIsMfaVerified(true)
      } else if (hasEnrolled) {
        // In production, if user has 2FA enabled, they are only verified if currentLevel is 'aal2'
        setIsMfaVerified(aalRes.data?.currentLevel === 'aal2')
      } else {
        // If user doesn't have 2FA enabled, standard login is sufficient
        setIsMfaVerified(true)
      }
    } catch (err) {
      console.error('Error checking MFA status:', err)
      setIsMfaVerified(true)
    }
  }

  const refreshMfaState = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    await checkMfa(session?.user ?? null)
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      await checkMfa(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      await checkMfa(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error, requires2FA: false }

      // Check if this account has 2FA enabled
      const [aalRes, factorsRes] = await Promise.all([
        supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
        supabase.auth.mfa.listFactors(),
      ])

      const isDev = import.meta.env.VITE_IS_DEV === 'true'
      const verifiedTotp = factorsRes.data?.totp?.find((f) => f.status === 'verified')
      const requires2FA = !isDev && Boolean(verifiedTotp && aalRes.data?.nextLevel === 'aal2')

      setHasMfaEnrolled(Boolean(verifiedTotp))
      setIsMfaVerified(isDev || !requires2FA)

      return { error: null, requires2FA }
    } catch (err: any) {
      return { error: err, requires2FA: false }
    }
  }

  const verifyMfa = async (code: string) => {
    try {
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
      if (factorsError) throw factorsError

      const verifiedFactor = factors?.totp?.find((f) => f.status === 'verified')
      if (!verifiedFactor) {
        throw new Error('No verified Google Authenticator factor found on this account')
      }

      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: verifiedFactor.id,
        code: code.trim(),
      })

      if (error) throw error

      setIsMfaVerified(true)
      return { error: null }
    } catch (err: any) {
      return { error: err }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setHasMfaEnrolled(false)
    setIsMfaVerified(false)
  }

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        loading,
        hasMfaEnrolled,
        isMfaVerified,
        signIn,
        verifyMfa,
        refreshMfaState,
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthContextType {
  return useContext(AdminAuthContext)
}
