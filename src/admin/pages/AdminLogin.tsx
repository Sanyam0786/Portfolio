import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'
import { contact } from '../../../data/contact'

export default function AdminLogin(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, hasMfaEnrolled, isMfaVerified, signIn, verifyMfa, signOut } = useAdminAuth()

  const isDev = import.meta.env.VITE_IS_DEV === 'true'

  const [step, setStep] = useState<'credentials' | 'two-factor'>('credentials')
  const [email, setEmail] = useState<string>(isDev ? 'sanyammj786@gmail.com' : '')
  const [password, setPassword] = useState<string>(isDev ? '5446138380S' : '')
  const [totpCode, setTotpCode] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const totpInputRef = useRef<HTMLInputElement | null>(null)
  const from = (location.state as any)?.from?.pathname || '/admin'

  // If already authenticated with credentials but awaiting 2FA
  useEffect(() => {
    if (isDev && user) {
      navigate(from, { replace: true })
    } else if (user && hasMfaEnrolled && !isMfaVerified) {
      setStep('two-factor')
    } else if (user && isMfaVerified) {
      navigate(from, { replace: true })
    }
  }, [user, hasMfaEnrolled, isMfaVerified, from, navigate, isDev])

  // Focus 2FA input when step changes
  useEffect(() => {
    if (step === 'two-factor') {
      setTimeout(() => totpInputRef.current?.focus(), 150)
    }
  }, [step])

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError, requires2FA } = await signIn(email, password)

    if (signInError) {
      setError(signInError.message || 'Authentication failed. Please check your credentials.')
      setLoading(false)
    } else if (!isDev && requires2FA) {
      setLoading(false)
      setStep('two-factor')
    } else {
      navigate(from, { replace: true })
    }
  }

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (totpCode.trim().length !== 6) {
      setError('Please enter the full 6-digit code')
      return
    }

    setError('')
    setLoading(true)

    const { error: mfaError } = await verifyMfa(totpCode.trim())

    if (mfaError) {
      setError(mfaError.message || 'Invalid or expired code. Check Google Authenticator.')
      setLoading(false)
      setTotpCode('')
    } else {
      navigate(from, { replace: true })
    }
  }

  const handleBackToLogin = async () => {
    await signOut()
    setStep('credentials')
    setTotpCode('')
    setError('')
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 text-slate-100 z-10">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.2, 0.9, 0.2, 1] }}
        className="w-full max-w-md darkGlass p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative z-10 backdrop-blur-2xl"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Brand Header matching Website */}
        <div className="mb-6">
          <div className="mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {contact.name}
            </span>
          </div>
          <h2 className="section-title heading-gradient text-2xl sm:text-3xl">
            {step === 'credentials' ? 'Admin Sign In' : 'Two-Factor Check'}
          </h2>
          <div className="fancy-underline mt-2" />
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle size={15} className="flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'credentials' ? (
            /* Step 1: Email and Password */
            <motion.form
              key="step-credentials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onSubmit={handleCredentialsSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sanyammj786@gmail.com"
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/40 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-900 hover:bg-white transition-all shadow-md hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                {!loading && <ArrowRight size={15} />}
                {loading && <Loader2 size={15} className="animate-spin" />}
              </button>
            </motion.form>
          ) : (
            /* Step 2: Google Authenticator 2FA Verification */
            <motion.form
              key="step-2fa"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onSubmit={handleMfaSubmit}
              className="space-y-5"
            >
              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 text-center space-y-1">
                <Smartphone size={20} className="mx-auto text-slate-300 mb-1.5" />
                <p className="text-sm font-semibold text-slate-200">Google Authenticator</p>
                <p className="text-xs text-slate-400">
                  Open Google Authenticator on your phone and enter the 6-digit verification code.
                </p>
              </div>

              <div>
                <div className="relative max-w-[220px] mx-auto">
                  <input
                    ref={totpInputRef}
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    required
                    value={totpCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setTotpCode(val)
                    }}
                    placeholder="······"
                    className="w-full bg-slate-800/90 border-2 border-slate-600 rounded-2xl px-4 py-3 text-center font-mono text-2xl tracking-[0.35em] font-bold text-white focus:outline-none focus:border-slate-300 transition-all shadow-inner"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || totpCode.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-900 hover:bg-white transition-all shadow-md hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
              >
                <span>{loading ? 'Verifying Code...' : 'Verify & Sign In'}</span>
                {loading ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={16} />}
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-center text-xs text-slate-400 hover:text-white transition-colors pt-2"
              >
                Sign in with different credentials
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
