import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = window.scrollY
      const progress = windowHeight > 0 ? scrolled / windowHeight : 0
      setScrollProgress(progress)

      // Hide indicator when at bottom
      setIsVisible(progress < 0.95)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
      className="fixed right-8 bottom-12 z-40 flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress bar */}
      <div className="h-20 w-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="w-full bg-slate-600 dark:bg-slate-400 rounded-full"
          initial={{ height: 0 }}
          animate={{ height: `${scrollProgress * 100}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>

      {/* Animated chevron */}
      <motion.div
        className="text-slate-600 dark:text-slate-400"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 15 12 9 18 15"></polyline>
        </svg>
      </motion.div>

      {/* Scroll text (optional) */}
      <p className="text-xs text-slate-500 dark:text-slate-500 font-medium tracking-widest uppercase mt-2">
        Scroll
      </p>
    </motion.div>
  )
}