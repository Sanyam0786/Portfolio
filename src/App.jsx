import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Home from './pages/Home'
import BubbleBackground from './components/BubbleBackground'
import ScrollIndicator from './components/ScrollIndicator'
import { useTheme } from './context/ThemeContext'
import IntroAnimation from './components/IntroAnimation'

// Lazy load ProjectDetail for route-level code splitting
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))

export default function App() {
  const location = useLocation()
  const { isDark } = useTheme()
  const [hasShownIntro, setHasShownIntro] = useState(() => {
    try {
      return typeof window !== 'undefined' && sessionStorage.getItem('intro_seen') === 'true'
    } catch (_) {
      return false
    }
  })

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const handleIntroComplete = () => {
    setHasShownIntro(true)
    try {
      sessionStorage.setItem('intro_seen', 'true')
    } catch (_) {}
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative z-10"
    >
      {/* Intro Typing & Shift Animation on initial session open */}
      {!hasShownIntro && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}

      <BubbleBackground isDark={isDark} />
      <ScrollIndicator />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/projects/:id"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center p-6 text-slate-500 dark:text-slate-400">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <ProjectDetail />
            </Suspense>
          }
        />
        {/* Redirect any other path to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </motion.div>
  )
}
