import React, { useState, useEffect, useRef } from 'react'
import {
  ShieldCheck,
  Shield,
  X,
  Copy,
  Check,
  Loader2,
  Smartphone,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../context/AdminAuthContext'

interface TwoFactorModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TwoFactorModal({ isOpen, onClose }: TwoFactorModalProps): React.JSX.Element | null {
  const { hasMfaEnrolled, refreshMfaState } = useAdminAuth()

  // Enrollment states
  const [loading, setLoading] = useState<boolean>(false)
  const [factorId, setFactorId] = useState<string>('')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [secretKey, setSecretKey] = useState<string>('')
  const [verifyCode, setVerifyCode] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [step, setStep] = useState<'status' | 'enroll'>('status')

  const codeInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      setError('')
      setSuccessMessage('')
      setVerifyCode('')
      setStep(hasMfaEnrolled ? 'status' : 'enroll')
      if (!hasMfaEnrolled) {
        startEnrollment()
      }
    }
  }, [isOpen, hasMfaEnrolled])

  const startEnrollment = async () => {
    setLoading(true)
    setError('')
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors()
      if (factors?.totp) {
        for (const f of factors.totp) {
          if ((f.status as string) === 'unverified') {
            await supabase.auth.mfa.unenroll({ factorId: f.id })
          }
        }
      }

      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'Sanyam Portfolio',
      })

      if (enrollError) throw enrollError
      if (!data) throw new Error('Failed to generate 2FA credentials')

      setFactorId(data.id)
      setQrCodeUrl(data.totp.qr_code)
      setSecretKey(data.totp.secret)
      setStep('enroll')
    } catch (err: any) {
      console.error('Enrollment error:', err)
      setError(err.message || 'Failed to initiate 2FA enrollment')
    } finally {
      setLoading(false)
    }
  }

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleVerifyEnrollment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (verifyCode.trim().length !== 6) {
      setError('Please enter the full 6-digit code')
      return
    }

    setLoading(true)
    setError('')
    try {
      const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verifyCode.trim(),
      })

      if (verifyError) throw verifyError

      setSuccessMessage('Google Authenticator activated')
      await refreshMfaState()
      setStep('status')
    } catch (err: any) {
      console.error('Verification error:', err)
      setError(err.message || 'Invalid 6-digit code. Check your authenticator.')
    } finally {
      setLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!window.confirm('Disable Two-Factor Authentication?')) return

    setLoading(true)
    setError('')
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors()
      const verifiedFactor = factors?.totp?.find((f) => f.status === 'verified')

      if (verifiedFactor) {
        const { error: unenrollError } = await supabase.auth.mfa.unenroll({
          factorId: verifiedFactor.id,
        })
        if (unenrollError) throw unenrollError
      }

      await refreshMfaState()
      setSuccessMessage('2FA disabled')
      setStep('status')
    } catch (err: any) {
      console.error('Unenroll error:', err)
      setError(err.message || 'Failed to disable 2FA.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="darkGlass border border-slate-700/80 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block animate-pulse" />
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
              Two-Factor Authentication
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3.5 rounded-2xl text-xs bg-red-950/20 text-red-300 border border-red-500/30 flex items-center gap-2.5">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl text-xs darkGlass border border-emerald-500/30 text-emerald-300 flex items-center gap-2.5">
            <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Status: Active */}
        {hasMfaEnrolled && step === 'status' ? (
          <div className="space-y-4 py-1">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
              <ShieldCheck size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-white">Google Authenticator is Active</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your 6-digit TOTP verification code is required each time you sign in to the admin panel.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={handleDisable2FA}
                disabled={loading}
                className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
              >
                Disable 2FA
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-slate-100 text-slate-900 hover:bg-white shadow-sm transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Enrollment Setup */
          <div className="space-y-4">
            {loading && !qrCodeUrl ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2.5">
                <Loader2 size={24} className="animate-spin text-slate-400" />
                <p className="text-xs text-slate-400">Generating 2FA credentials...</p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-200">1. Scan with Google Authenticator</p>
                  <p className="text-xs text-slate-400">
                    Open Google Authenticator on your mobile device, tap <b>+</b> and scan:
                  </p>
                </div>

                {/* QR Code Container */}
                {qrCodeUrl && (
                  <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl w-fit mx-auto shadow-md">
                    <img
                      src={qrCodeUrl}
                      alt="Google Authenticator QR Code"
                      className="w-40 h-40 block rounded-lg select-none"
                    />
                  </div>
                )}

                {/* Secret Key fallback */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <KeyRound size={13} />
                      <span>Manual Secret Key:</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className="text-slate-300 hover:text-white font-mono text-xs underline"
                    >
                      {copied ? 'Copied!' : 'Copy Key'}
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 font-mono text-xs text-slate-300 text-center tracking-wider select-all">
                    {secretKey}
                  </div>
                </div>

                {/* Step 2 Form */}
                <form onSubmit={handleVerifyEnrollment} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                      2. Enter the 6-digit verification code
                    </label>
                    <div className="relative">
                      <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        ref={codeInputRef}
                        type="text"
                        maxLength={6}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        placeholder="123456"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-center font-mono text-lg tracking-[0.25em] font-semibold text-white focus:outline-none focus:ring-2 focus:ring-slate-500/40"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading || verifyCode.length !== 6}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-slate-100 text-slate-900 hover:bg-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                      {loading && <Loader2 size={13} className="animate-spin" />}
                      <span>{loading ? 'Verifying...' : 'Enable 2FA'}</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
