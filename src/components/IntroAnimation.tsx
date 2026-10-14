import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { contact } from '../../data/contact'
import { useIntro } from '../context/IntroContext'

export interface IntroAnimationProps {
  onComplete?: () => void
}

type AnimationPhase = 'typing' | 'pausing' | 'shifting' | 'done'

interface DockOffset {
  x: number
  y: number
  scale: number
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps): React.JSX.Element | null {
  const [displayedText, setDisplayedText] = useState<string>('')
  const [phase, setPhase] = useState<AnimationPhase>('typing') // 'typing' | 'pausing' | 'shifting' | 'done'
  const [dockOffset, setDockOffset] = useState<DockOffset>({ x: 0, y: -260, scale: 0.38 })
  const { setIntroPhase } = useIntro()
  const centerRef = useRef<HTMLDivElement | null>(null)
  const fullName = contact.name || 'Sanyam Mujavadia'

  // Ensure page is pinned to top and scroll is locked while intro is active
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    const originalOverflow = document.body.style.overflow
    if (phase !== 'done') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalOverflow || ''
    }

    return () => {
      document.body.style.overflow = originalOverflow || ''
    }
  }, [phase])

  // Calculate target logo position dynamically on mount/resize
  useEffect(() => {
    const updateTargetOffset = () => {
      const brandLogo = document.getElementById('navbar-brand-text') || document.getElementById('navbar-brand-logo')
      const centerEl = centerRef.current
      if (brandLogo && centerEl) {
        const logoRect = brandLogo.getBoundingClientRect()
        const centerRect = centerEl.getBoundingClientRect()

        const deltaX = (logoRect.left + logoRect.width / 2) - (centerRect.left + centerRect.width / 2)
        const deltaY = (logoRect.top + logoRect.height / 2) - (centerRect.top + centerRect.height / 2)
        const scale = Math.min(Math.max(logoRect.height / centerRect.height, 0.3), 0.48)

        setDockOffset({ x: deltaX, y: deltaY, scale })
      }
    }

    updateTargetOffset()
    window.addEventListener('resize', updateTargetOffset)
    const timer = setTimeout(updateTargetOffset, 150)
    return () => {
      window.removeEventListener('resize', updateTargetOffset)
      clearTimeout(timer)
    }
  }, [])

  // Typewriter effect
  useEffect(() => {
    let index = 0
    const typingSpeed = 50 // ms per character

    const typingInterval = setInterval(() => {
      if (index < fullName.length) {
        setDisplayedText(fullName.slice(0, index + 1))
        index++
      } else {
        clearInterval(typingInterval)
        setPhase('pausing')

        // Short pause after complete typing before shift
        setTimeout(() => {
          setPhase('shifting')
          setIntroPhase('shifting')

          // Complete intro after shift animation completes smoothly
          setTimeout(() => {
            setPhase('done')
            setIntroPhase('done')
            if (onComplete) onComplete()
          }, 1250)
        }, 450)
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [fullName, onComplete, setIntroPhase])

  if (phase === 'done') return null

  return (
    <AnimatePresence>
      <motion.div
        key="intro-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'shifting' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-950 ${phase === 'shifting' ? 'pointer-events-none' : ''
          }`}
      >
        {/* Dynamic ambient background glow orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-500/25 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Center Intro Container / Flying Brand Name */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6">
          <motion.div
            ref={centerRef}
            id="intro-center-name"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: phase === 'shifting' ? dockOffset.scale : 1,
              opacity: phase === 'shifting' ? 0 : 1,
              x: phase === 'shifting' ? dockOffset.x : 0,
              y: phase === 'shifting' ? dockOffset.y : 0,
            }}
            transition={{
              duration: 1.15, // Smooth slowed down flight
              ease: [0.22, 1, 0.36, 1], // Gentle decelerating curve
            }}
            className="flex items-center text-center origin-center"
          >

            {/* Typed Name Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center whitespace-nowrap">
              <span>{displayedText}</span>

              {/* Blinking Cursor */}
              {phase !== 'shifting' && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.75, ease: 'easeInOut' }}
                  className="inline-block w-[3px] sm:w-[4px] h-7 sm:h-11 md:h-14 bg-indigo-600 dark:bg-indigo-400 ml-1.5 rounded-full align-middle"
                />
              )}
            </h1>
          </motion.div>

          {/* Subtitle tag that fades out when shifting */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: phase === 'typing' || phase === 'pausing' ? 0.7 : 0,
              y: phase === 'shifting' ? 20 : 0,
            }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-slate-500 dark:text-slate-400"
          >
            {contact.role || 'React Native Specialist'}
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
