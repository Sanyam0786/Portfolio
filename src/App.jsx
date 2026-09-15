import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import BubbleBackground from './components/BubbleBackground'
import './index.css'
import ScrollIndicator from './components/ScrollIndicator'
import { useTheme } from './context/ThemeContext'

export default function App() {

  const location = useLocation()
  const { isDark } = useTheme()

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
      <BubbleBackground isDark={isDark} />
      <ScrollIndicator />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Routes>
    </motion.div>
  )
}
