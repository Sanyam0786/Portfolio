import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import BubbleBackground from './components/BubbleBackground'
import './index.css'
import ScrollIndicator from './components/ScrollIndicator'
import { useTheme } from './context/ThemeContext'
import IntroAnimation from './components/IntroAnimation'

export default function App() {
  const location = useLocation()
  const { isDark } = useTheme()
  const [hasShownIntro, setHasShownIntro] = useState(false)

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative z-10"
    >
      {/* Intro Typing & Shift Animation on initial open */}
      {!hasShownIntro && (
        <IntroAnimation onComplete={() => setHasShownIntro(true)} />
      )}

      <BubbleBackground isDark={isDark} />
      <ScrollIndicator />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        {/* Redirect any other path to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </motion.div>
  )
}
