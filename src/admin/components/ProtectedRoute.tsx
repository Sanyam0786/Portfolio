import React, { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }): React.JSX.Element {
  const { user, loading, hasMfaEnrolled, isMfaVerified } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Verifying session & 2FA...</p>
        </div>
      </div>
    )
  }

  // Not logged in at all
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  const isDev = import.meta.env.VITE_IS_DEV === 'true'

  // Logged in with password, but account has 2FA enabled and user hasn't passed 2FA yet (bypassed in dev mode)
  if (!isDev && hasMfaEnrolled && !isMfaVerified) {
    return <Navigate to="/admin/login" state={{ from: location, requireMfa: true }} replace />
  }

  return <>{children}</>
}
