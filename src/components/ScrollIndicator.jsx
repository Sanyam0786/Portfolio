import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = window.scrollY
      const progress = windowHeight > 0 ? scrolled / windowHeight : 0
      setScrollProgress(progress)
      setHasScrolled(scrolled > 120)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      <motion.button
        onClick={scrollToTop}
        className="fixed right-6 sm:right-8 bottom-8 sm:bottom-12 z-40 flex flex-col items-center gap-3 cursor-pointer group select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full p-2"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        whileHover={{ scale: 1.08, y: -3 }}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.3 }}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        {/* Progress bar */}
        <div className="h-16 sm:h-20 w-1 bg-slate-200/80 dark:bg-slate-700/80 group-hover:bg-slate-300 dark:group-hover:bg-slate-600 rounded-full overflow-hidden transition-colors">
          <motion.div
            className="w-full bg-slate-700 dark:bg-slate-300 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 rounded-full transition-colors"
            style={{ height: `${Math.max(scrollProgress * 100, 6)}%` }}
          />
        </div>

        {/* Animated chevron arrow */}
        <motion.div
          className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </motion.div>

        {/* Scroll / Top text */}
        <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 font-semibold tracking-widest uppercase transition-colors">
          {'Scroll'}
        </span>
      </motion.button>
    </AnimatePresence>
  )
}