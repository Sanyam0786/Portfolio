import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react'
import { useDesignTheme, DesignTheme } from '../context/DesignThemeContext'

export default function AdminThemeSelector(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { activeTheme, setActiveTheme, isNewDesign, isBubble } = useDesignTheme()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Secret ID Guard
  const isValidSecret = id === '786'

  // Replace history on mount and intercept popstate so admin page is never retained in back-history
  useEffect(() => {
    if (isValidSecret) {
      window.history.replaceState(null, '', window.location.href)
    }

    const handlePopState = () => {
      navigate('/', { replace: true })
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isValidSecret, navigate])

  const handleExit = () => {
    navigate('/', { replace: true })
  }

  const handleSelectTheme = (theme: DesignTheme) => {
    setActiveTheme(theme)
    const displayName = theme === 'monochrome_design' || theme === 'new_design' || theme === 'newdesign' || theme === 'monochrome' ? 'Monochrome Design' : 'BubbleBackground Design'
    setToastMessage(`Switched active theme to ${displayName}`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Redirect back to home if secret ID is invalid
  if (!isValidSecret) {
    return <Navigate to="/" replace />
  }

  // Authorized Admin Theme Switcher Screen
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans antialiased selection:bg-slate-700 selection:text-white">
      {/* Background Lighting */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(100,116,139,0.18),transparent)]" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_80%,rgba(30,41,59,0.25),transparent_60%)]" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 z-50 px-5 py-2.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 shadow-xl backdrop-blur-xl"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative max-w-2xl w-full space-y-7 z-10"
      >
        {/* Top Header Card */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Portfolio Design Switcher
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Select which design variant should be active for your public portfolio. Only one design can be active at a time.
          </p>
        </div>

        {/* Theme Selection Cards (Radio / Checkbox Behavior) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option 1: BubbleBackground Design */}
          <div
            onClick={() => handleSelectTheme('bubble')}
            className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between border backdrop-blur-xl ${isBubble
                ? 'bg-slate-900/90 border-slate-400/60 shadow-2xl shadow-slate-900/60 ring-2 ring-slate-400/30'
                : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
          >
            {/* Active Pill */}
            {isBubble && (
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500 text-slate-950 uppercase tracking-wider shadow-md">
                Active
              </span>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles size={20} />
                </div>

                {/* Checkbox / Radio Circle */}
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isBubble
                      ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                      : 'border-slate-700 bg-slate-800/50'
                    }`}
                >
                  {isBubble && <Check size={14} strokeWidth={3} />}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">BubbleBackground Design</h3>
                </div>
                <code className="text-[10px] text-indigo-300 font-mono block mt-0.5">src/bubble_background_design</code>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  The original rich aesthetic with floating bubbles, colorful accents, glassmorphic cards, and dynamic light/dark support.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                  Bubbles
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                  Light/Dark
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                  Intro Animation
                </span>
              </div>
            </div>
          </div>

          {/* Option 2: Monochrome Design */}
          <div
            onClick={() => handleSelectTheme('monochrome_design')}
            className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between border backdrop-blur-xl ${isNewDesign
                ? 'bg-slate-900/90 border-white/60 shadow-2xl shadow-slate-900/60 ring-2 ring-white/30'
                : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
          >
            {/* Active Pill */}
            {isNewDesign && (
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white text-black uppercase tracking-wider shadow-md">
                Active
              </span>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Layers size={20} />
                </div>

                {/* Checkbox / Radio Circle */}
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isNewDesign
                      ? 'border-white bg-white text-black'
                      : 'border-slate-700 bg-slate-800/50'
                    }`}
                >
                  {isNewDesign && <Check size={14} strokeWidth={3} />}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">Monochrome Design</h3>
                </div>
                <code className="text-[10px] text-zinc-300 font-mono block mt-0.5">src/monochrome_design</code>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Ultra-minimalist editorial black & white theme with clean architectural grids, high contrast, and refined typography.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                  Black & White
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                  Architectural
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                  High Contrast
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
          <button
            onClick={handleExit}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-white text-slate-950 hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <span>View Live Portfolio</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
